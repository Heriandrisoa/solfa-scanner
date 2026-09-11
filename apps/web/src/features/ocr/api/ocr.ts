/**
 * OCR wrapper around Tesseract.js.
 *
 * Uses WebAssembly to run Tesseract in-browser. The worker is cached
 * after first use so subsequent recognitions are fast.
 */
import Tesseract from "tesseract.js";

let workerPromise: Promise<Tesseract.Worker> | null = null;

async function getWorker(): Promise<Tesseract.Worker> {
  if (!workerPromise) {
    workerPromise = Tesseract.createWorker("eng", undefined, {
      logger: () => {},
    });
  }
  return workerPromise;
}

export interface OcrResult {
  text: string;
  firstLine: string;
  confidence: number;
}

/**
 * Recognize text in an image file.
 * Returns the full text, first line, and average confidence.
 */
export async function recognizeText(file: File): Promise<OcrResult> {
  const worker = await getWorker();

  const { data } = await worker.recognize(file);

  const lines = data.text.split("\n").filter((l) => l.trim().length > 0);

  return {
    text: data.text,
    firstLine: lines[0] ?? "",
    confidence: data.confidence,
  };
}

/**
 * Terminate the worker (call on app unload or to free memory).
 */
export async function terminateOcr(): Promise<void> {
  if (workerPromise) {
    const worker = await workerPromise;
    await worker.terminate();
    workerPromise = null;
  }
}
