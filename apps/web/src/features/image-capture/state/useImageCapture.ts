import { useCallback, useEffect, useRef, useState } from "react";

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const MAX_SIZE_MB = 20;
const MAX_PAGES = 10;

export interface CapturedImage {
  file: File;
  previewUrl: string;
}

interface UseImageCaptureReturn {
  images: CapturedImage[];
  pendingFile: File | null;
  error: string | null;
  addImage: (file: File) => void;
  acceptPending: (processedFile: File) => void;
  retakePending: () => void;
  removeImage: (index: number) => void;
  canAddMore: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  triggerFileInput: () => void;
}

export function useImageCapture(): UseImageCaptureReturn {
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      for (const img of images) {
        URL.revokeObjectURL(img.previewUrl);
      }
    };
  }, [images]);

  const validateAndSetPending = useCallback((file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError(
        `"${file.name}" is not a supported image type. Use JPEG, PNG, WebP, or HEIC.`,
      );
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    setPendingFile(file);
  }, []);

  const addImage = useCallback(
    (file: File) => {
      validateAndSetPending(file);
    },
    [validateAndSetPending],
  );

  const acceptPending = useCallback(
    (processedFile: File) => {
      if (!pendingFile) return;
      setImages((prev) => [
        ...prev,
        { file: processedFile, previewUrl: URL.createObjectURL(processedFile) },
      ]);
      setPendingFile(null);
    },
    [pendingFile],
  );

  const retakePending = useCallback(() => {
    setPendingFile(null);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const triggerFileInput = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return {
    images,
    pendingFile,
    error,
    addImage,
    acceptPending,
    retakePending,
    removeImage,
    canAddMore: images.length < MAX_PAGES,
    inputRef,
    triggerFileInput,
  };
}
