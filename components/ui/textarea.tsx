"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-3 text-sm text-charcoal bg-white border border-slate-300 rounded-lg",
            "placeholder:text-slate-400",
            "transition-all duration-200",
            "hover:border-slate-400",
            "focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
            "resize-none",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            props.disabled && "bg-slate-50 text-slate-500 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
