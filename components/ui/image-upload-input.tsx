import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadInputProps {
  id: string;
  label?: string;
  recommended?: string;
  disabled?: boolean;
  currentImageUrl?: string | null;
  currentImageAlt?: string;
  onFileChange?: (file: File | null) => void;
}

export function ImageUploadInput({
  id,
  label = "Upload Image",
  recommended = "PNG, JPG up to 5MB. Recommended: 200x200px",
  disabled = false,
  currentImageUrl,
  currentImageAlt,
  onFileChange,
}: ImageUploadInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onFileChange) onFileChange(file);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      if (onFileChange) onFileChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleClear = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-base font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              width={80}
              height={80}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt={currentImageAlt || "Current image"}
              width={80}
              height={80}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-white">
              <Upload className="h-8 w-8 opacity-60" />
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative overflow-hidden"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="mr-2 h-4 w-4" />
              {file || currentImageUrl ? "Change Image" : "Upload Image"}
            </Button>
            {(!!file || !!previewUrl || !!currentImageUrl) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-red-600 hover:text-red-700"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{recommended}</p>
          {file && <span className="text-xs text-foreground">Selected: {file.name}</span>}
        </div>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
