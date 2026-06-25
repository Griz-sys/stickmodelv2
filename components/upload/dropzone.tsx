"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileUp, X, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxSize?: number; // in bytes
  disabled?: boolean;
  multiple?: boolean;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

const MAX_SIZE = 1024 * 1024 * 1024; // 1GB

const ACCEPTED_EXTENSIONS = [
  ".pdf", ".zip", ".dwg", ".dxf",
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".webp", ".heic", ".heif", ".svg",
];

function isAccepted(file: File): boolean {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(ext) || file.type.startsWith("image/");
}

export function Dropzone({
  onFilesAdded,
  maxSize = MAX_SIZE,
  disabled = false,
  multiple = false,
  selectedFiles = [],
  onRemoveFile,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    (raw: FileList | File[]) => {
      const files = Array.from(raw).filter(
        (f) => isAccepted(f) && f.size <= maxSize,
      );
      if (files.length > 0) onFilesAdded(files);
    },
    [maxSize, onFilesAdded],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

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
      processFiles(e.dataTransfer.files);
    },
    [disabled, processFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
      e.target.value = "";
    },
    [processFiles],
  );

  const hasFiles = selectedFiles.length > 0;

  return (
    <div className="space-y-3">
      {/* Selected files list */}
      {hasFiles && (
        <div className="space-y-2">
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-slate-800 truncate min-w-0">
                {file.name}
              </span>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {formatFileSize(file.size)}
              </span>
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={() => onRemoveFile(i)}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-amber-100 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "dropzone relative overflow-hidden",
          isDragging && "active",
          disabled && "opacity-50 cursor-not-allowed",
          hasFiles && "py-0",
        )}
      >
        <label
          className={cn(
            "flex flex-col items-center justify-center cursor-pointer",
            hasFiles ? "py-5 px-8" : "py-12 px-8",
            disabled && "cursor-not-allowed",
          )}
        >
          <input
            type="file"
            className="sr-only"
            accept={ACCEPTED_EXTENSIONS.join(",") + ",image/*"}
            multiple={multiple}
            onChange={handleFileInput}
            disabled={disabled}
          />

          <div
            className={cn(
              "rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
              hasFiles ? "w-10 h-10" : "w-14 h-14 mb-4",
              isDragging ? "bg-amber-100 scale-110" : "bg-slate-100",
            )}
          >
            {isDragging ? (
              <FileUp
                className={cn(
                  "text-amber-600 animate-bounce",
                  hasFiles ? "w-5 h-5" : "w-7 h-7",
                )}
              />
            ) : (
              <Upload
                className={cn(
                  "text-slate-400",
                  hasFiles ? "w-5 h-5" : "w-7 h-7",
                )}
              />
            )}
          </div>

          <p className="text-sm font-medium text-charcoal mb-0.5">
            {hasFiles
              ? isDragging
                ? "Drop to add more"
                : "Add more files"
              : isDragging
                ? "Drop your files here"
                : multiple
                  ? "Drag & drop your files here"
                  : "Drag & drop your file here"}
          </p>
          <p className="text-xs text-slate-500">or click to browse</p>
          {!hasFiles && (
            <p className="mt-3 text-xs font-medium text-amber-700 text-center">
              Accepted: PDF, ZIP, DWG, DXF, Images · Max 1 GB
              {multiple && " · Select multiple files"}
            </p>
          )}
        </label>
      </div>
    </div>
  );
}
