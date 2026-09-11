/**
 * Image preprocessing with OpenCV.js.
 *
 * Pipeline: load → auto-crop → deskew → normalize → output blob.
 * All cv.Mat objects are deleted after use to avoid memory leaks.
 *
 * Uses the global `cv` object provided by OpenCV.js after loading.
 */

/**
 * Load an image File into a cv.Mat via a temporary canvas.
 */
export function fileToMat(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(img.src);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert cv.Mat to a Blob (File-like).
 */
export function matToBlob(mat: cv.Mat, mimeType = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    cv.imshow(canvas, mat);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert to blob"));
      },
      mimeType,
      0.95,
    );
  });
}

/**
 * Auto-crop: find the largest contour (page boundary) and crop to it.
 * Falls back to full image if no clear boundary found.
 */
export function autoCrop(src: cv.Mat): cv.Mat {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edged = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edged, 50, 150);

    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
    cv.dilate(edged, edged, kernel, new cv.Point(-1, -1), 2);
    kernel.delete();

    cv.findContours(edged, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    hierarchy.delete();

    if (contours.size() === 0) {
      return src.clone();
    }

    let largestIdx = 0;
    let largestArea = 0;
    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i));
      if (area > largestArea) {
        largestArea = area;
        largestIdx = i;
      }
    }

    const largestContour = contours.get(largestIdx);
    const peri = cv.arcLength(largestContour, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(largestContour, approx, 0.02 * peri, true);

    if (approx.rows === 4) {
      const cropped = orderPointsAndWarp(src, approx);
      approx.delete();
      return cropped;
    }

    const rect = cv.boundingRect(largestContour);
    approx.delete();

    const pad = 10;
    const x = Math.max(0, rect.x - pad);
    const y = Math.max(0, rect.y - pad);
    const w = Math.min(src.cols - x, rect.width + 2 * pad);
    const h = Math.min(src.rows - y, rect.height + 2 * pad);

    return src.roi(new cv.Rect(x, y, w, h)).clone();
  } finally {
    gray.delete();
    blurred.delete();
    edged.delete();
    contours.delete();
  }
}

/**
 * Order 4 corner points (tl, tr, br, bl) and apply perspective warp.
 */
function orderPointsAndWarp(src: cv.Mat, pts: cv.Mat): cv.Mat {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < pts.rows; i++) {
    points.push({ x: pts.intAt(i, 0), y: pts.intAt(i, 1) });
  }

  const sorted = [...points].sort((a, b) => a.x + a.y - (b.x + b.y));
  const tl = sorted[0];
  const br = sorted[sorted.length - 1];

  const remaining = sorted.slice(1, -1).sort((a, b) => a.x - a.y - (b.x - b.y));
  const tr = remaining[0];
  const bl = remaining[remaining.length - 1];

  const widthA = Math.hypot(br.x - bl.x, br.y - bl.y);
  const widthB = Math.hypot(br.x - tr.x, br.y - tr.y);
  const maxWidth = Math.max(Math.round(widthA), Math.round(widthB));

  const heightA = Math.hypot(tr.x - br.x, tr.y - br.y);
  const heightB = Math.hypot(tl.x - bl.x, tl.y - bl.y);
  const maxHeight = Math.max(Math.round(heightA), Math.round(heightB));

  const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y,
  ]);
  const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0, maxWidth - 1, 0, maxWidth - 1, maxHeight - 1, 0, maxHeight - 1,
  ]);
  const M = cv.getPerspectiveTransform(srcPts, dstPts);
  const dsize = new cv.Size(maxWidth, maxHeight);
  const warped = new cv.Mat();
  cv.warpPerspective(src, warped, M, dsize, cv.INTER_LINEAR);

  srcPts.delete();
  dstPts.delete();
  M.delete();

  return warped;
}

/**
 * Deskew using minAreaRect.
 */
export function deskew(src: cv.Mat): cv.Mat {
  const gray = new cv.Mat();
  const edged = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.Canny(gray, edged, 50, 150);

    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
    cv.dilate(edged, edged, kernel, new cv.Point(-1, -1), 2);
    kernel.delete();

    cv.findContours(edged, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    hierarchy.delete();

    if (contours.size() === 0) return src.clone();

    let largestIdx = 0;
    let largestArea = 0;
    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i));
      if (area > largestArea) {
        largestArea = area;
        largestIdx = i;
      }
    }

    const rect = cv.minAreaRect(contours.get(largestIdx));
    const angle = rect.angle;

    if (Math.abs(angle) < 0.5) return src.clone();

    const rotAngle = rect.size.width < rect.size.height ? angle + 90 : angle;

    const center = new cv.Point(src.cols / 2, src.rows / 2);
    const M = cv.getRotationMatrix2D(center, rotAngle, 1.0);
    const rotated = new cv.Mat();
    cv.warpAffine(src, rotated, M, new cv.Size(src.cols, src.rows), cv.INTER_LINEAR);
    M.delete();

    return rotated;
  } finally {
    gray.delete();
    edged.delete();
    contours.delete();
  }
}

/**
 * Normalize contrast and brightness using CLAHE.
 */
export function normalize(src: cv.Mat): cv.Mat {
  const lab = new cv.Mat();
  const lChannel = new cv.Mat();
  const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
  const result = new cv.Mat();

  try {
    cv.cvtColor(src, lab, cv.COLOR_RGBA2RGB);
    cv.cvtColor(lab, lab, cv.COLOR_RGB2Lab);

    const channels = new cv.MatVector();
    cv.split(lab, channels);
    channels.get(0).copyTo(lChannel);

    clahe.apply(lChannel, lChannel);

    channels.set(0, lChannel);
    cv.merge(channels, lab);

    cv.cvtColor(lab, lab, cv.COLOR_Lab2RGB);
    cv.cvtColor(lab, result, cv.COLOR_RGB2RGBA);

    channels.delete();
    return result;
  } finally {
    lab.delete();
    lChannel.delete();
    clahe.delete();
  }
}

/**
 * Full preprocessing pipeline: crop → deskew → normalize.
 * Returns the processed cv.Mat. Caller must delete it.
 */
export function processImage(src: cv.Mat): cv.Mat {
  let result = autoCrop(src);
  const deskewed = deskew(result);
  if (result !== src) result.delete();
  result = deskewed;
  const normalized = normalize(result);
  result.delete();
  return normalized;
}
