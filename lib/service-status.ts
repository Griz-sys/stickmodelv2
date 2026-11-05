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

// Dates are stored as UTC midnight from a <input type="date">, so format in UTC to avoid off-by-one
export function formatResumeDate(iso: string | null): string {
  if (!iso) return "soon";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
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
