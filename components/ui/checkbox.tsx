"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "flex items-start gap-3 cursor-pointer group",
          props.disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 border-2 border-slate-300 rounded-md transition-all duration-200",
              "group-hover:border-amber-400",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/20 peer-focus-visible:border-amber-500",
              "peer-checked:bg-amber-400 peer-checked:border-amber-400"
            )}
          />
          <Check
            className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 text-charcoal transition-all duration-200",
              "opacity-0 scale-50",
              "peer-checked:opacity-100 peer-checked:scale-100"
            )}
            strokeWidth={3}
          />
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span className="block text-sm font-medium text-charcoal">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-sm text-slate-500 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
