"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileUp } from "lucide-react";

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxSize?: number; // in bytes
  disabled?: boolean;
}

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export function Dropzone({
  onFilesAdded,
  maxSize = MAX_SIZE,
  disabled = false,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

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

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return ext === "pdf" && file.size <= maxSize;
      });

      // Only take the first file
      if (droppedFiles.length > 0) {
        onFilesAdded([droppedFiles[0]]);
      }
    },
    [maxSize, disabled, onFilesAdded]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.size <= maxSize) {
          onFilesAdded([file]);
        }
      }
      // Reset input
      e.target.value = "";
    },
    [maxSize, onFilesAdded]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "dropzone relative overflow-hidden",
        isDragging && "active",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <label
        className={cn(
          "flex flex-col items-center justify-center py-12 px-8 cursor-pointer",
          disabled && "cursor-not-allowed"
        )}
      >
        <input
          type="file"
          className="sr-only"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={disabled}
        />

        {/* Icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
            isDragging
              ? "bg-amber-100 scale-110"
              : "bg-slate-100"
          )}
        >
          {isDragging ? (
            <FileUp className="w-7 h-7 text-amber-600 animate-bounce" />
          ) : (
            <Upload className="w-7 h-7 text-slate-400" />
          )}
        </div>

        {/* Text */}
        <p className="text-base font-medium text-charcoal mb-1">
          {isDragging ? "Drop your file here" : "Drag & drop your file here"}
        </p>
        <p className="text-sm text-slate-500">or click to browse</p>
      </label>
    </div>
  );
}
