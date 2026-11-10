"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ServiceStatusBar } from "@/components/ServiceStatusBar";
import {
  DEFAULT_RESUME_TIME,
  DEFAULT_SERVICE_STATUS,
  SERVICE_MODES,
  isoToIst,
  istToIso,
  type ServiceStatus,
} from "@/lib/service-status";

export function ServiceStatusEditor() {
  const [status, setStatus] = useState<ServiceStatus>(DEFAULT_SERVICE_STATUS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  // Kept separately so a time can be picked before the date
  const [resumeTime, setResumeTime] = useState(DEFAULT_RESUME_TIME);

  useEffect(() => {
    fetch("/api/service-status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.status) {
          setStatus(data.status);
          setSavedAt(data.status.updatedAt ?? null);
          if (data.status.resumeDate)
            setResumeTime(isoToIst(data.status.resumeDate).time);
        }
      })
      .catch((err) => console.error("Failed to fetch service status:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const update = (patch: Partial<ServiceStatus>) => {
    setStatus((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/service-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to save status");
        return;
      }
      setStatus(data.status);
      setSavedAt(data.status.updatedAt ?? null);
    } catch (err) {
      console.error("Failed to save service status:", err);
      setError("Failed to save status");
    } finally {
      setIsSaving(false);
    }
  };

  const resume = isoToIst(status.resumeDate);

  const needsWaitDays =
    status.mode === "busy_standard" || status.mode === "busy_discount";

  return (
    <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Delivery Status
          </h2>
          <p className="text-sm text-slate-500">
            Shown to every client at the top of their dashboard.
          </p>
        </div>
        {savedAt && (
          <p className="text-xs text-slate-400">
            Last updated {new Date(savedAt).toLocaleString()}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => update({ mode: mode.value })}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  status.mode === mode.value
                    ? "border-amber-500 bg-amber-50 text-amber-900"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {status.mode === "off" && (
              <div className="md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Work resumes on (IST)
                </span>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={resume.date}
                    onChange={(e) =>
                      update({
                        resumeDate: istToIso(e.target.value, resumeTime),
                      })
                    }
                  />
                  <Input
                    type="time"
                    value={resumeTime}
                    onChange={(e) => {
                      setResumeTime(e.target.value);
                      if (resume.date)
                        update({
                          resumeDate: istToIso(resume.date, e.target.value),
                        });
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Status switches back to standard 24 hr delivery automatically
                  at this time.
                </p>
              </div>
            )}
            {needsWaitDays && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Days of waiting
                </span>
                <Input
                  type="number"
                  min={1}
                  value={status.waitDays ?? ""}
                  onChange={(e) =>
                    update({
                      waitDays: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </label>
            )}
            {status.mode === "busy_discount" && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Discounted rate
                </span>
                <Input
                  placeholder='e.g. "20% off" or "$150 / model"'
                  value={status.customRate ?? ""}
                  onChange={(e) => update({ customRate: e.target.value })}
                />
              </label>
            )}
            <label
              className={cn(
                "block",
                status.mode === "standard" && "md:col-span-3",
              )}
            >
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Extra note (optional)
              </span>
              <Input
                placeholder="Shown under the status"
                value={status.note ?? ""}
                onChange={(e) => update({ note: e.target.value })}
              />
            </label>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Client preview
          </p>
          <ServiceStatusBar status={status} className="mb-4" />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save Status
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}
