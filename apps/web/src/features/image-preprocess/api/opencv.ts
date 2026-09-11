/**
 * Lazy OpenCV.js loader.
 *
 * OpenCV.js is ~15MB — we only load it when the user actually uploads
 * an image, not on app start. Returns a ready-to-use `cv` object.
 */
import type { CV } from "@techstark/opencv-js";

let cvPromise: Promise<CV> | null = null;

export async function loadOpenCv(): Promise<CV> {
  if (cvPromise) return cvPromise;

  cvPromise = (async () => {
    const cvModule = await import("@techstark/opencv-js");
    const candidate = (cvModule as { default?: unknown }).default ?? cvModule;

    if (candidate instanceof Promise) {
      return (await candidate) as CV;
    }
    if (candidate && (candidate as CV).Mat) {
      return candidate as CV;
    }
    await new Promise<void>((resolve) => {
      (candidate as { onRuntimeInitialized?: () => void }).onRuntimeInitialized = () => resolve();
    });
    return candidate as CV;
  })();

  return cvPromise;
}