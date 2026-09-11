import type { OcrStatus } from "../state/useOcr";
import type { OcrResult as OcrResultType } from "../api/ocr";
import styles from "./OcrResult.module.css";

interface OcrResultProps {
  status: OcrStatus;
  result: OcrResultType | null;
  error: string | null;
}

export function OcrResultView({ status, result, error }: OcrResultProps) {
  if (status === "loading") {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing} />
          <span>Recognizing text...</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error ?? "OCR failed"}</div>
      </div>
    );
  }

  if (status === "done" && result) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>OCR Result</span>
          <span className={styles.confidence}>
            {Math.round(result.confidence)}% confidence
          </span>
        </div>
        {result.firstLine && (
          <div className={styles.firstLine}>{result.firstLine}</div>
        )}
        {result.text && (
          <div className={styles.text}>{result.text}</div>
        )}
      </div>
    );
  }

  return null;
}
