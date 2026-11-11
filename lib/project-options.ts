// Shared (client + server) project scope and pricing for the new project form.
// Option ids are stored on Project.options, so don't rename existing ids.
//
// Pricing: main steel is BASE_RATE / tonne plus every selected per-tonne add-on.
// If the project has misc steel, misc is priced separately at MISC_BASE_RATE / tonne
// plus the same add-ons. Flat fees are charged once per project.

export const BASE_RATE = 1.2; // USD / tonne, main steel
export const MISC_BASE_RATE = 1.5; // USD / tonne, misc steel
export const MISC_OPTION_ID = "misc";

export interface IncludedItem {
  label: string;
  description?: string;
}

export interface ProjectOption {
  id: string;
  label: string;
  description?: string;
  rate: number; // USD
  unit: "tonne" | "flat";
  unavailable?: boolean; // shown greyed out as "Coming soon"; remove to enable
}

// Always part of every project — covered by the base rate
export const INCLUDED_ITEMS: IncludedItem[] = [
  { label: "ABM — Main Steel", description: "Advance Bill of Material for main steel" },
  { label: "KSS" },
  { label: "IFC" },
  { label: "List of Assumptions" },
  { label: "Set of RFIs" },
];

// Add-ons, applied on top of both the main steel and misc steel rates
export const PROJECT_OPTIONS: ProjectOption[] = [
  {
    id: "connection_material",
    label: "ABM — Connection Material",
    description: "Connection material added to the bill of material",
    rate: 0.1,
    unit: "tonne",
    unavailable: true,
  },
  {
    id: "labour_code",
    label: "Labour Code",
    rate: 0.1,
    unit: "tonne",
    unavailable: true,
  },
  {
    id: "tekla_model",
    label: "Tekla Model",
    description: "Native Tekla Structures model",
    rate: 20,
    unit: "flat",
  },
  {
    id: "sheet_number",
    label: "Sheet Number",
    rate: 0.1,
    unit: "tonne",
  },
];

// Misc steel is not an add-on: it adds a second, separately priced rate to the project
export const MISC_OPTION: ProjectOption = {
  id: MISC_OPTION_ID,
  label: "Misc Steel",
  description: "Priced separately from main steel",
  rate: MISC_BASE_RATE,
  unit: "tonne",
  unavailable: true,
};

export function getProjectOption(id: string): ProjectOption | undefined {
  if (id === MISC_OPTION_ID) return MISC_OPTION;
  return PROJECT_OPTIONS.find((o) => o.id === id);
}

// Keep only known, available, unique option ids (in canonical order)
export function sanitizeProjectOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...PROJECT_OPTIONS, MISC_OPTION]
    .filter((o) => !o.unavailable && value.includes(o.id))
    .map((o) => o.id);
}

export function formatOptionRate(option: Pick<ProjectOption, "rate" | "unit">): string {
  return option.unit === "flat"
    ? `$${option.rate.toFixed(2)} flat`
    : `$${option.rate.toFixed(2)} / tonne`;
}

export function summarizeProjectRates(ids: string[]): {
  addOnsPerTonne: number;
  mainRate: number;
  miscRate: number | null; // null when the project has no misc steel
  flat: number;
} {
  let addOnsPerTonne = 0;
  let flat = 0;
  for (const option of PROJECT_OPTIONS) {
    if (!ids.includes(option.id)) continue;
    if (option.unit === "tonne") addOnsPerTonne += option.rate;
    else flat += option.rate;
  }
  return {
    addOnsPerTonne,
    mainRate: BASE_RATE + addOnsPerTonne,
    miscRate: ids.includes(MISC_OPTION_ID)
      ? MISC_BASE_RATE + addOnsPerTonne
      : null,
    flat,
  };
}
