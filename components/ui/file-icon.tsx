import { cn } from "@/lib/utils";

interface FileIconProps {
  type: "pdf" | "ifc" | "csv" | "file";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const typeConfig: Record<string, { bg: string; text: string; label: string }> = {
  pdf: { bg: "bg-rose-100", text: "text-rose-600", label: "PDF" },
  ifc: { bg: "bg-amber-100", text: "text-amber-600", label: "IFC" },
  csv: { bg: "bg-slate-100", text: "text-slate-600", label: "CSV" },
  file: { bg: "bg-slate-100", text: "text-slate-600", label: "FILE" },
};

const sizes = {
  sm: "w-8 h-8 text-[8px] rounded-lg",
  md: "w-10 h-10 text-[9px] rounded-xl",
  lg: "w-12 h-12 text-[10px] rounded-xl",
};

export function FileIcon({ type, size = "md", className }: FileIconProps) {
  const config = typeConfig[type] || typeConfig.file;

  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold tracking-tight",
        config.bg,
        config.text,
        sizes[size],
        className
      )}
    >
      {config.label}
    </div>
  );
}
