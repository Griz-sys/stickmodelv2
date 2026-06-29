"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";

export interface PostFormValues {
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  bodyContent: string;
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  onSaveDraft: (values: PostFormValues) => Promise<void>;
  onPublish: (values: PostFormValues) => Promise<void>;
  saving: boolean;
  currentStatus?: string;
}

export function PostForm({
  initialValues,
  onSaveDraft,
  onPublish,
  saving,
  currentStatus,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && initialValues?.bodyContent) {
      editorRef.current.innerHTML = initialValues.bodyContent;
    }
  }, []);

  function getValues(): PostFormValues {
    return {
      title,
      excerpt,
      coverImage,
      category,
      bodyContent: editorRef.current?.innerHTML ?? "",
    };
  }

  function execCmd(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed (JPEG, PNG, WebP, GIF).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be under 10 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/blog/upload-cover", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
      } else {
        setCoverImage(data.url);
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  const isValid = title.trim() && excerpt.trim() && category.trim() && coverImage;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 120))}
          placeholder="e.g. Optimising Grid Alignment for Multi-Story Frames"
          className="w-full border border-stone-200 px-4 py-3 text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E67E00] transition-colors"
        />
        <p className="text-right text-[11px] text-stone-400 mt-1">
          {title.length} / 120
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">
          Excerpt <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
          placeholder="Short summary shown on blog tiles..."
          rows={3}
          className="w-full border border-stone-200 px-4 py-3 text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E67E00] transition-colors resize-y"
        />
        <p className="text-right text-[11px] text-stone-400 mt-1">
          {excerpt.length} / 300
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">
          Category <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. BIM Workflows, Tekla Structures, Engineering"
          className="w-full border border-stone-200 px-4 py-3 text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E67E00] transition-colors"
        />
      </div>

      {/* Cover image upload */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-3">
          Cover Image <span className="text-rose-500">*</span>
        </label>

        {coverImage ? (
          <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1 transition-colors"
              title="Remove image"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-sm border border-stone-300 transition-colors"
            >
              Change image
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`w-full aspect-[16/9] rounded-sm border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragOver
                ? "border-[#E67E00] bg-orange-50"
                : "border-stone-300 hover:border-[#E67E00] hover:bg-stone-50"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-7 h-7 border-2 border-stone-200 border-t-[#E67E00] rounded-full animate-spin" />
                <p className="text-sm text-stone-500">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <ImageIcon size={32} className="text-stone-400" />
                <p className="text-sm font-semibold text-slate-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-stone-400">
                  JPEG, PNG, WebP, GIF — max 10 MB
                </p>
              </div>
            )}
          </div>
        )}

        {uploadError && (
          <p className="mt-2 text-xs text-rose-600">{uploadError}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Rich text body */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">
          Body <span className="text-rose-500">*</span>
        </label>
        <div className="flex flex-wrap items-center gap-1 border border-stone-200 border-b-0 bg-stone-50 px-3 py-2">
          {[
            { label: "B", cmd: "bold", style: "font-bold" },
            { label: "I", cmd: "italic", style: "italic" },
            { label: "U", cmd: "underline", style: "underline" },
          ].map(({ label, cmd, style }) => (
            <button
              key={cmd}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
              className={`w-7 h-7 flex items-center justify-center text-xs ${style} text-slate-600 hover:bg-stone-200 rounded transition-colors`}
            >
              {label}
            </button>
          ))}
          <div className="w-px h-4 bg-stone-300 mx-1" />
          {[
            { label: "H2", cmd: "formatBlock", value: "H2" },
            { label: "H3", cmd: "formatBlock", value: "H3" },
          ].map(({ label, cmd, value }) => (
            <button
              key={label}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd(cmd, value); }}
              className="px-2 h-7 flex items-center justify-center text-xs font-semibold text-slate-600 hover:bg-stone-200 rounded transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="w-px h-4 bg-stone-300 mx-1" />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd("insertUnorderedList"); }}
            className="px-2 h-7 flex items-center justify-center text-xs text-slate-600 hover:bg-stone-200 rounded transition-colors"
          >
            • List
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd("insertOrderedList"); }}
            className="px-2 h-7 flex items-center justify-center text-xs text-slate-600 hover:bg-stone-200 rounded transition-colors"
          >
            1. List
          </button>
          <div className="w-px h-4 bg-stone-300 mx-1" />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd("removeFormat"); }}
            className="px-2 h-7 flex items-center justify-center text-xs text-slate-600 hover:bg-stone-200 rounded transition-colors"
          >
            Clear
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[280px] border border-stone-200 px-4 py-4 text-sm text-slate-700 focus:outline-none focus:border-[#E67E00] transition-colors"
          data-placeholder="Write your engineering insights here..."
          style={{ wordBreak: "break-word" }}
        />
        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #a8a29e;
            pointer-events: none;
          }
        `}</style>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
        <button
          type="button"
          disabled={!isValid || saving || uploading}
          onClick={() => onSaveDraft(getValues())}
          className="border border-slate-300 text-slate-700 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          disabled={!isValid || saving || uploading}
          onClick={() => onPublish(getValues())}
          className="bg-[#E67E00] text-white px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-[#d66c00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving
            ? "Saving…"
            : currentStatus === "published"
            ? "Update Post"
            : "Publish"}
        </button>
        {currentStatus === "published" && (
          <button
            type="button"
            disabled={saving}
            onClick={() => onSaveDraft(getValues())}
            className="text-slate-500 text-sm hover:text-slate-700 transition-colors"
          >
            Unpublish (save as draft)
          </button>
        )}
      </div>
    </div>
  );
}
