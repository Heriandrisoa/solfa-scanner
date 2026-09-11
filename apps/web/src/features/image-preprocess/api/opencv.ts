/**
 * Lazy OpenCV.js loader.
 *
 * OpenCV.js is ~15MB — we only load it when the user actually uploads
 * an image, not on app start. Returns a ready-to-use `cv` object.
 */
import type OpenCvType from "@techstark/opencv-js";

let cvPromise: Promise<typeof OpenCvType> | null = null;

export async function loadOpenCv(): Promise<typeof OpenCvType> {
  if (cvPromise) return cvPromise;

  cvPromise = (async () => {
    const cvModule = await import("@techstark/opencv-js");

    const cv = cvModule.default ?? cvModule;

    // If it's a promise, await it
    if (cv instanceof Promise) {
      return cv;
    }

    // If it has onRuntimeInitialized, wait for it
    if (typeof cv === "object" && cv !== null && "onRuntimeInitialized" in cv) {
      await new Promise<void>((resolve) => {
        (cv as { onRuntimeInitialized: () => void }).onRuntimeInitialized = () => resolve();
      });
    }

    return cv as typeof OpenCvType;
  })();

  return cvPromise;
}
