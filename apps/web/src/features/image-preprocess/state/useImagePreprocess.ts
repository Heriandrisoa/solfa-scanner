import { useCallback, useState } from "react";
import { loadOpenCv } from "../api/opencv";
import { fileToMat, matToBlob, processImage } from "../api/preprocess";

export type PreprocessStatus = "idle" | "loading-opencv" | "processing" | "done" | "error";

interface ProcessedImage {
  original: File;
  processed: File;
  originalUrl: string;
  processedUrl: string;
}

interface UseImagePreprocessReturn {
  status: PreprocessStatus;
  processed: ProcessedImage | null;
  error: string | null;
  process: (file: File) => void;
  accept: () => void;
  retake: () => void;
  reset: () => void;
}

export function useImagePreprocess(): UseImagePreprocessReturn {
  const [status, setStatus] = useState<PreprocessStatus>("idle");
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(async (file: File) => {
    setStatus("loading-opencv");
    setError(null);
    setProcessed(null);

    try {
      await loadOpenCv();
      setStatus("processing");

      const canvas = await fileToMat(file);
      const srcMat = cv.imread(canvas);
      const processedMat = processImage(srcMat);

      const blob = await matToBlob(processedMat);
      const processedFile = new File([blob], file.name, { type: "image/png" });

      srcMat.delete();
      processedMat.delete();

      setProcessed({
        original: file,
        processed: processedFile,
        originalUrl: URL.createObjectURL(file),
        processedUrl: URL.createObjectURL(processedFile),
      });
      setStatus("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed";
      setError(msg);
      setStatus("error");
    }
  }, []);

  const accept = useCallback(() => {
    // Keep the processed image — parent reads `processed`
  }, []);

  const retake = useCallback(() => {
    if (processed) {
      URL.revokeObjectURL(processed.originalUrl);
      URL.revokeObjectURL(processed.processedUrl);
    }
    setProcessed(null);
    setStatus("idle");
    setError(null);
  }, [processed]);

  const reset = useCallback(() => {
    if (processed) {
      URL.revokeObjectURL(processed.originalUrl);
      URL.revokeObjectURL(processed.processedUrl);
    }
    setProcessed(null);
    setStatus("idle");
    setError(null);
  }, [processed]);

  return { status, processed, error, process, accept, retake, reset };
}
