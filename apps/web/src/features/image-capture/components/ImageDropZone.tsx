import { useCallback, useState } from "react";
import type { CapturedImage } from "../state/useImageCapture";
import { Button } from "../../../components/atoms/Button";
import { Icon } from "../../../components/atoms/Icon";
import styles from "./ImageDropZone.module.css";

interface ImageDropZoneProps {
  images: CapturedImage[];
  error: string | null;
  canAddMore: boolean;
  onImageAdded: (file: File) => void;
  onImageRemoved: (index: number) => void;
  onOpenPicker: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ImageDropZone({
  images,
  error,
  canAddMore,
  onImageAdded,
  onImageRemoved,
  onOpenPicker,
  fileInputRef,
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const isEmpty = images.length === 0;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      for (const file of e.dataTransfer.files) {
        onImageAdded(file);
      }
    },
    [onImageAdded],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        for (const file of files) {
          onImageAdded(file);
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onImageAdded, fileInputRef],
  );

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className={styles.hiddenInput}
        onChange={handleInputChange}
        tabIndex={-1}
      />

      {error && (
        <div className={styles.error}>
          <Icon name="error" size={16} />
          {error}
        </div>
      )}

      {isEmpty ? (
        <div
          className={styles.emptyContent}
          onClick={onOpenPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenPicker();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload an image"
        >
          <Icon name="image" size={48} className={styles.emptyIcon} />
          <p className={styles.label}>
            <strong>Click to upload</strong> or drag and drop
            <br />
            JPEG, PNG, WebP, or HEIC
          </p>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <Button
            variant="primary"
            size="md"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onOpenPicker();
          }}
          >
            <Icon name="camera" size={16} />
            Use camera
          </Button>
        </div>
      ) : (
        <div className={styles.thumbnailGrid}>
          {images.map((img, index) => (
            <div key={img.previewUrl} className={styles.thumbnail}>
              <img
                src={img.previewUrl}
                alt={`Page ${index + 1}`}
                className={styles.thumbnailImage}
              />
              <span className={styles.pageNumber}>{index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                className={styles.removeBtn}
                onClick={() => onImageRemoved(index)}
                aria-label={`Remove page ${index + 1}`}
              >
                <Icon name="close" size={14} />
              </Button>
            </div>
          ))}

          {canAddMore ? (
            <button
              type="button"
              className={styles.addMoreBtn}
              onClick={onOpenPicker}
            >
              <Icon name="plus" size={20} />
              <span>Add page</span>
            </button>
          ) : (
            <p className={styles.maxHint}>Maximum 10 pages</p>
          )}
        </div>
      )}
    </div>
  );
}
