// Shared (client + server) definitions for the admin-controlled delivery status bar.

export type ServiceMode = "standard" | "off" | "busy_standard" | "busy_discount";

export interface ServiceStatus {
  mode: ServiceMode;
  resumeDate: string | null; // ISO string
  waitDays: number | null;
  customRate: string | null;
  note: string | null;
  updatedAt?: string;
}

export const SERVICE_MODES: { value: ServiceMode; label: string }[] = [
  { value: "standard", label: "Standard 24 hr delivery" },
  { value: "off", label: "Team off — resumes on a date" },
  { value: "busy_standard", label: "Busy — wait time, standard rate" },
  { value: "busy_discount", label: "Busy — wait time, discounted rate" },
];

export const DEFAULT_SERVICE_STATUS: ServiceStatus = {
  mode: "standard",
  resumeDate: null,
  waitDays: null,
  customRate: null,
  note: null,
};

export function isServiceMode(value: unknown): value is ServiceMode {
  return SERVICE_MODES.some((m) => m.value === value);
}

// Resume times are entered and shown in IST (UTC+5:30), regardless of the viewer's timezone
const IST_OFFSET = "+05:30";
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
export const DEFAULT_RESUME_TIME = "09:00";

// "2026-11-08" + "09:00" (IST) -> ISO string in UTC
export function istToIso(date: string, time: string): string | null {
  if (!date) return null;
  const parsed = new Date(`${date}T${time || DEFAULT_RESUME_TIME}:00${IST_OFFSET}`);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// ISO string -> { date: "2026-11-08", time: "09:00" } in IST, for date/time inputs
export function isoToIst(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: DEFAULT_RESUME_TIME };
  const shifted = new Date(new Date(iso).getTime() + IST_OFFSET_MS).toISOString();
  return { date: shifted.slice(0, 10), time: shifted.slice(11, 16) };
}

export function formatResumeDate(iso: string | null): string {
  if (!iso) return "soon";
  return `${new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })} IST`;
}

// "Team off" automatically ends once the resume time has passed
export function isBreakOver(status: ServiceStatus, now: Date = new Date()): boolean {
  return (
    status.mode === "off" &&
    !!status.resumeDate &&
    new Date(status.resumeDate).getTime() <= now.getTime()
  );
}

export function getEffectiveStatus(
  status: ServiceStatus,
  now: Date = new Date(),
): ServiceStatus {
  return isBreakOver(status, now)
    ? { ...DEFAULT_SERVICE_STATUS, note: null, updatedAt: status.updatedAt }
    : status;
}

function daysLabel(days: number | null): string {
  if (!days) return "a few days";
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function describeServiceStatus(status: ServiceStatus): {
  title: string;
  detail: string;
} {
  switch (status.mode) {
    case "off":
      return {
        title: `Our team is currently off — work resumes on ${formatResumeDate(status.resumeDate)}`,
        detail:
          "You can still upload drawings now; they will be picked up as soon as we're back.",
      };
    case "busy_standard":
      return {
        title: `High demand — approx. ${daysLabel(status.waitDays)} of waiting before delivery`,
        detail: "Standard rates apply.",
      };
    case "busy_discount":
      return {
        title: `High demand — approx. ${daysLabel(status.waitDays)} of waiting before delivery`,
        detail: status.customRate
          ? `Discounted rate for the wait: ${status.customRate}`
          : "A discounted rate applies for the wait.",
      };
    default:
      return {
        title: "Standard 24 hr delivery",
        detail: "Models are delivered within 24 hours of confirmation.",
      };
  }
}
