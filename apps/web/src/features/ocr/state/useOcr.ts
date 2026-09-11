import { useCallback, useState } from "react";
import { recognizeText, type OcrResult } from "../api/ocr";

export type OcrStatus = "idle" | "loading" | "done" | "error";

interface UseOcrReturn {
  status: OcrStatus;
  result: OcrResult | null;
  error: string | null;
  run: (file: File) => void;
  reset: () => void;
}

export function useOcr(): UseOcrReturn {
  const [status, setStatus] = useState<OcrStatus>("idle");
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (file: File) => {
    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const ocrResult = await recognizeText(file);
      setResult(ocrResult);
      setStatus("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "OCR failed";
      setError(msg);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, run, reset };
}
