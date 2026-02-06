import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle2,
  Download,
} from "lucide-react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "processing";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  error: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  processing: "bg-orange-50 text-orange-700 border border-orange-200",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Status-specific badge with icons
type RequestStatus =
  | "uploaded"
  | "in_progress"
  | "finished"
  | "processing"
  | "ready"
  | "downloaded"
  | "issue";

const statusConfig: Record<
  RequestStatus,
  {
    label: string;
    variant: BadgeVariant;
    icon: React.ReactNode;
  }
> = {
  uploaded: {
    label: "Uploaded",
    variant: "info",
    icon: <Clock className="w-3 h-3" />,
  },
  in_progress: {
    label: "In Progress",
    variant: "processing",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  finished: {
    label: "Finished",
    variant: "success",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  // Legacy status values for compatibility
  processing: {
    label: "In Process",
    variant: "processing",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  ready: {
    label: "Ready",
    variant: "success",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  downloaded: {
    label: "Downloaded",
    variant: "default",
    icon: <Download className="w-3 h-3" />,
  },
  issue: {
    label: "Issue",
    variant: "error",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as RequestStatus] || {
    label: status,
    variant: "default" as BadgeVariant,
    icon: null,
  };

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}
