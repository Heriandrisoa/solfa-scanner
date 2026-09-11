import { Button } from "../../../components/atoms/Button";
import type { PreprocessStatus } from "../state/useImagePreprocess";
import styles from "./ImageCompare.module.css";

interface ImageCompareProps {
  status: PreprocessStatus;
  originalUrl: string | null;
  processedUrl: string | null;
  error: string | null;
  onAccept: () => void;
  onRetake: () => void;
}

export function ImageCompare({
  status,
  originalUrl,
  processedUrl,
  error,
  onAccept,
  onRetake,
}: ImageCompareProps) {
  if (status === "loading-opencv" || status === "processing") {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing} />
          <span>
            {status === "loading-opencv"
              ? "Loading image tools..."
              : "Processing image..."}
          </span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span>{error ?? "Processing failed"}</span>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={onRetake}>
            Retake
          </Button>
        </div>
      </div>
    );
  }

  if (status === "done" && originalUrl && processedUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.compare}>
          <div className={styles.side}>
            <span className={styles.label}>Original</span>
            <img
              src={originalUrl}
              alt="Original"
              className={styles.sideImage}
            />
          </div>
          <div className={styles.side}>
            <span className={styles.label}>Processed</span>
            <img
              src={processedUrl}
              alt="Processed"
              className={styles.sideImage}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={onRetake}>
            Retake
          </Button>
          <Button variant="primary" size="md" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
