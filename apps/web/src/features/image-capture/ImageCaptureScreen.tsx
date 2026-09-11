import { useEffect } from "react";
import { useImageCapture } from "./state/useImageCapture";
import { ImageDropZone } from "./components/ImageDropZone";
import { ImageCompare } from "../image-preprocess/components/ImageCompare";
import { useImagePreprocess } from "../image-preprocess/state/useImagePreprocess";
import { Button } from "../../components/atoms/Button";
import { Icon } from "../../components/atoms/Icon";

export function ImageCaptureScreen() {
  const {
    images,
    pendingFile,
    error,
    addImage,
    acceptPending,
    retakePending,
    removeImage,
    canAddMore,
    inputRef,
    triggerFileInput,
  } = useImageCapture();

  const {
    status,
    processed,
    error: processError,
    process,
    accept,
    retake,
  } = useImagePreprocess();

  // Auto-process when a new file is set as pending
  useEffect(() => {
    if (pendingFile && status === "idle") {
      process(pendingFile);
    }
  }, [pendingFile, status, process]);

  const handleAccept = () => {
    if (processed) {
      accept();
      acceptPending(processed.processed);
    }
  };

  const handleRetake = () => {
    retake();
    retakePending();
  };

  const pageCount = images.length;
  const isProcessing = pendingFile !== null;

  return (
    <section>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "var(--space-2)",
          }}
        >
          Scan a hymn sheet
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          {pageCount === 0
            ? "Take a photo or upload an image of tonic sol-fa notation."
            : `${pageCount} page${pageCount !== 1 ? "s" : ""} added`}
        </p>
      </div>

      {isProcessing ? (
        <ImageCompare
          status={status}
          originalUrl={processed?.originalUrl ?? null}
          processedUrl={processed?.processedUrl ?? null}
          error={processError}
          onAccept={handleAccept}
          onRetake={handleRetake}
        />
      ) : (
        <ImageDropZone
          images={images}
          error={error}
          canAddMore={canAddMore}
          onImageAdded={addImage}
          onImageRemoved={removeImage}
          onOpenPicker={triggerFileInput}
          fileInputRef={inputRef}
        />
      )}

      {pageCount > 0 && !isProcessing && (
        <div
          style={{
            marginTop: "var(--space-6)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="primary" size="lg">
            Continue
            <Icon name="arrow-right" size={14} />
          </Button>
        </div>
      )}
    </section>
  );
}
