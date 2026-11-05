"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Clock, Tag, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  describeServiceStatus,
  type ServiceMode,
  type ServiceStatus,
} from "@/lib/service-status";

const MODE_STYLES: Record<
  ServiceMode,
  { wrapper: string; iconWrap: string; icon: React.ReactNode }
> = {
  standard: {
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-900",
    iconWrap: "bg-emerald-500 text-white",
    icon: <Zap className="h-4 w-4" />,
  },
  off: {
    wrapper: "border-slate-300 bg-slate-100 text-slate-800",
    iconWrap: "bg-slate-500 text-white",
    icon: <CalendarClock className="h-4 w-4" />,
  },
  busy_standard: {
    wrapper: "border-amber-200 bg-amber-50 text-amber-900",
    iconWrap: "bg-amber-500 text-white",
    icon: <Clock className="h-4 w-4" />,
  },
  busy_discount: {
    wrapper: "border-violet-200 bg-violet-50 text-violet-900",
    iconWrap: "bg-violet-500 text-white",
    icon: <Tag className="h-4 w-4" />,
  },
};

// Presentational bar; pass `status` directly (e.g. admin preview) or let it fetch itself
export function ServiceStatusBar({
  status: statusProp,
  className,
}: {
  status?: ServiceStatus;
  className?: string;
}) {
  const [fetched, setFetched] = useState<ServiceStatus | null>(null);

  useEffect(() => {
    if (statusProp) return;
    fetch("/api/service-status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.status && setFetched(data.status))
      .catch((error) => console.error("Failed to fetch service status:", error));
  }, [statusProp]);

  const status = statusProp ?? fetched;
  if (!status) return null;

  const { title, detail } = describeServiceStatus(status);
  const styles = MODE_STYLES[status.mode] ?? MODE_STYLES.standard;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 animate-fade-in",
        styles.wrapper,
        className,
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          styles.iconWrap,
        )}
      >
        {styles.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm opacity-80">{detail}</p>
        {status.note && <p className="mt-1 text-sm opacity-80">{status.note}</p>}
      </div>
    </div>
  );
}
