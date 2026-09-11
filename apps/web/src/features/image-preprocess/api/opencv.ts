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
    const mod = await import("@techstark/opencv-js");

    // The default export is either a Promise or the cv object itself
    const candidate = mod.default ?? mod;

    // Case 1: it's a Promise (async Emscripten factory)
    if (candidate instanceof Promise) {
      return (await candidate) as CV;
    }

    // Case 2: it already has Mat — it's the initialized cv object
    if (candidate && typeof candidate === "object" && "Mat" in candidate) {
      return candidate as CV;
    }

    // Case 3: fallback — the module object might need the WASM to load.
    // We can't assign onRuntimeInitialized to a frozen object,
    // so we poll until Mat appears or a timeout is reached.
    return new Promise<CV>((resolve, reject) => {
      const start = Date.now();
      const timeout = 30_000;

      const check = () => {
        if (candidate && typeof candidate === "object" && "Mat" in candidate) {
          resolve(candidate as CV);
        } else if (Date.now() - start > timeout) {
          reject(new Error("OpenCV.js failed to initialize within 30s"));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  })();

  return cvPromise;
}
