/**
 * Lazy OpenCV.js loader.
 *
 * OpenCV.js is ~15MB — we only load it when the user actually uploads
 * an image, not on app start. Uses Vite's ?url import to get a direct
 * URL to the UMD bundle, then loads it via <script> tag.
 */
import type { CV } from "@techstark/opencv-js";
import opencvJsUrl from "@techstark/opencv-js/dist/opencv.js?url";

let cvPromise: Promise<CV> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-opencv]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.opencv = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load OpenCV.js from ${src}`));
    document.head.appendChild(s);
  });
}

export async function loadOpenCv(): Promise<CV> {
  if (cvPromise) return cvPromise;

  cvPromise = (async () => {
    await loadScript(opencvJsUrl);

    const g = globalThis as Record<string, unknown>;
    const cvFactory = g.cv;

    if (typeof cvFactory === "function") {
      // cv is the async Emscripten factory — call it to init WASM
      const result = await (cvFactory as () => Promise<unknown>)();
      return result as CV;
    }

    if (cvFactory && typeof cvFactory === "object" && "Mat" in (cvFactory as object)) {
      return cvFactory as CV;
    }

    throw new Error(
      "OpenCV.js loaded but cv global is not available or not initialized",
    );
  })();

  return cvPromise;
}
