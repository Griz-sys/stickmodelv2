"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dropzone } from "@/components/upload/dropzone";
import { ServiceStatusBar } from "@/components/ServiceStatusBar";
import JSZip from "jszip";
import { cn } from "@/lib/utils";
import {
  BASE_RATE,
  INCLUDED_ITEMS,
  MISC_BASE_RATE,
  MISC_OPTION,
  MISC_OPTION_ID,
  PROJECT_OPTIONS,
  formatOptionRate,
  summarizeProjectRates,
  type ProjectOption,
} from "@/lib/project-options";
import { ArrowLeft, ArrowRight, Check, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface UploadedFile {
  file: File;
}

export default function NewRequestPage() {
  const router = useRouter();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [projectName, setProjectName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [confirmFiles, setConfirmFiles] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    confirmFiles && confirmTerms && projectName.trim() && uploadedFiles.length > 0;

  const handleFileAdded = useCallback((files: File[]) => {
    if (files.length > 0) {
      setUploadedFiles((prev) => {
        // Deduplicate by name
        const existingNames = new Set(prev.map((f) => f.file.name));
        const newOnes = files
          .filter((f) => !existingNames.has(f.name))
          .map((f) => ({ file: f }));
        return [...prev, ...newOnes];
      });
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleOption = (id: string, checked: boolean) => {
    setSelectedOptions((prev) =>
      checked ? [...prev, id] : prev.filter((o) => o !== id),
    );
  };

  const hasMisc = selectedOptions.includes(MISC_OPTION_ID);
  const selectedAddOns = PROJECT_OPTIONS.filter((o) =>
    selectedOptions.includes(o.id),
  );
  const rates = summarizeProjectRates(selectedOptions);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0 || !canSubmit) return;

    setIsSubmitting(true);

    try {
      // Step 1: Create project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          notes: notes.trim() || null,
          options: selectedOptions,
        }),
      });

      if (projectResponse.status === 401) {
        router.push("/");
        return;
      }

      if (!projectResponse.ok) {
        const errorText = await projectResponse.text();
        console.error("Create project failed:", errorText);
        throw new Error("Failed to create project");
      }

      const { project } = await projectResponse.json();

      // Step 2: If multiple files, zip them; otherwise upload directly
      let fileToUpload: File;
      if (uploadedFiles.length === 1) {
        fileToUpload = uploadedFiles[0].file;
      } else {
        const zip = new JSZip();
        for (const { file } of uploadedFiles) {
          zip.file(file.name, file);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        fileToUpload = new File(
          [zipBlob],
          `${projectName.trim().replace(/[^a-z0-9]/gi, "_")}_files.zip`,
          { type: "application/zip" },
        );
      }

      // Step 3: Upload the file (single or zipped)
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("projectId", project.id);
      formData.append("isAdminResponse", "false");

      const tokenRes = await fetch("/api/blob/upload", {
        method: "POST",
        body: formData,
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.error || "Failed to upload file");
      }

      const { url: publicUrl } = await tokenRes.json();

      // Step 4: Attach file to project
      const updateResponse = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userFileName: fileToUpload.name,
          userFileUrl: publicUrl,
          userFileSize: fileToUpload.size,
          userFileType: fileToUpload.type || "application/zip",
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData.error || "Failed to update project with file URL",
        );
      }

      router.push(`/requests/${project.id}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* ==================== TOP NAVBAR ==================== */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <img
                src="/horizontal.svg"
                alt="StickModel"
                className="h-7 w-auto"
              />
            </Link>
            <span className="text-slate-300 text-lg">/</span>
            <Link
              href="/home"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              My Projects
            </Link>
            <span className="text-slate-300 text-lg">/</span>
            <span className="text-sm font-semibold text-slate-900">
              New Project
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <ServiceStatusBar className="mb-6" />

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-charcoal mb-1">
            Create New Project
          </h1>
          <p className="text-slate-500">
            Upload your structural drawings and tell us about the project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="animate-fade-in lg:col-span-2">
          <CardContent className="p-8 space-y-6">
            {/* File picker — shows selected files + allows adding more */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-700">
                Files to upload
                {uploadedFiles.length > 1 && (
                  <span className="ml-2 text-xs font-normal text-amber-600">
                    ({uploadedFiles.length} files · will be zipped into one)
                  </span>
                )}
              </p>
              <Dropzone
                onFilesAdded={handleFileAdded}
                multiple
                selectedFiles={uploadedFiles.map((f) => f.file)}
                onRemoveFile={handleRemoveFile}
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Project Name"
                placeholder="e.g., Tower Block A - Phase 1"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500">
                Give your project a descriptive name for easy identification
              </p>
            </div>

            {/* Scope: always-included items + optional add-ons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">
                Project Scope
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Included
                  </p>
                  <span className="text-sm font-medium text-slate-600">
                    Base ${BASE_RATE.toFixed(2)} / tonne
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {INCLUDED_ITEMS.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-2 text-sm text-charcoal"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <span>
                        {item.label}
                        {item.description && (
                          <span className="block text-xs text-slate-500">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  hasMisc
                    ? "border-violet-300 bg-violet-50"
                    : "border-slate-200",
                  MISC_OPTION.unavailable && "bg-slate-50",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <Checkbox
                    checked={hasMisc}
                    disabled={MISC_OPTION.unavailable}
                    onChange={(e) =>
                      toggleOption(MISC_OPTION_ID, e.target.checked)
                    }
                    label="Misc Steel"
                    description="Misc steel is priced separately from main steel, at its own base rate plus the selected add-ons"
                  />
                  <OptionPrice unavailable={MISC_OPTION.unavailable}>
                    Base ${MISC_BASE_RATE.toFixed(2)} / tonne
                  </OptionPrice>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Optional add-ons
                </p>
                {PROJECT_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <Checkbox
                      checked={selectedOptions.includes(option.id)}
                      disabled={option.unavailable}
                      onChange={(e) => toggleOption(option.id, e.target.checked)}
                      label={option.label}
                      description={option.description}
                    />
                    <OptionPrice unavailable={option.unavailable}>
                      +{formatOptionRate(option)}
                    </OptionPrice>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                label="Additional Notes (optional)"
                placeholder="Any specific requirements or details about this project..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-slate-500">
                Help us understand your project better with any additional
                details
              </p>
              <p className="text-xs font-medium text-amber-700">
                Any extra services would be chargeable.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="space-y-3">
                <Checkbox
                  checked={confirmFiles}
                  onChange={(e) => setConfirmFiles(e.target.checked)}
                  label="I confirm that I have verified the files being uploaded, and I have the authority to use and share these files."
                />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={confirmTerms}
                      onChange={(e) => setConfirmTerms(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded transition-all duration-200 group-hover:border-amber-400 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/20 peer-focus-visible:border-amber-500 peer-checked:bg-amber-500 peer-checked:border-amber-500" />
                    <svg
                      className="absolute top-0.5 left-0.5 w-4 h-4 text-white transition-all duration-200 opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-charcoal">
                    I confirm that I have read the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-medium"
                    >
                      terms of use
                    </a>
                    .
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  variant="secondary"
                  className="sm:w-40"
                  onClick={() => router.push("/home")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!canSubmit}
                >
                  {isSubmitting
                    ? uploadedFiles.length > 1
                      ? "Zipping & Uploading..."
                      : "Creating Project..."
                    : "Create Project"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate panel */}
        <Card
          className="animate-fade-in lg:sticky lg:top-24"
          style={{ animationDelay: "100ms" }}
        >
          <CardContent className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-charcoal">Rate</h2>

            <RateBlock
              title="Main Steel"
              baseRate={BASE_RATE}
              addOns={selectedAddOns}
              total={rates.mainRate}
            />

            {rates.miscRate !== null && (
              <RateBlock
                title="Misc Steel"
                baseRate={MISC_BASE_RATE}
                addOns={selectedAddOns}
                total={rates.miscRate}
                accent
              />
            )}

            {rates.flat > 0 && (
              <div className="space-y-2 rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  One-time fees
                </p>
                {selectedAddOns
                  .filter((o) => o.unit === "flat")
                  .map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-slate-600">{o.label}</span>
                      <span className="font-semibold text-charcoal">
                        ${o.rate.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            <p className="text-xs text-slate-500">
              Per-tonne rates are applied to the final steel tonnage
              {rates.miscRate !== null && " (main and misc steel separately)"}.
              The final project cost is confirmed by our team after review.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

// ==================== OPTION PRICE ====================
function OptionPrice({
  unavailable,
  children,
}: {
  unavailable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-shrink-0 flex-col items-end gap-1">
      <span
        className={cn(
          "text-sm font-medium text-slate-600",
          unavailable && "opacity-60",
        )}
      >
        {children}
      </span>
      {unavailable && (
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Coming soon
        </span>
      )}
    </div>
  );
}

// ==================== RATE BLOCK ====================
function RateBlock({
  title,
  baseRate,
  addOns,
  total,
  accent = false,
}: {
  title: string;
  baseRate: number;
  addOns: ProjectOption[];
  total: number;
  accent?: boolean;
}) {
  const perTonneAddOns = addOns.filter((o) => o.unit === "tonne");

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border p-4",
        accent ? "border-violet-300 bg-violet-50" : "border-slate-200",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-600">Base rate</span>
        <span className="font-medium text-charcoal">
          ${baseRate.toFixed(2)} / t
        </span>
      </div>
      {perTonneAddOns.map((o) => (
        <div
          key={o.id}
          className="flex items-center justify-between gap-3 text-sm"
        >
          <span className="text-slate-600">{o.label}</span>
          <span className="font-medium text-charcoal">
            +${o.rate.toFixed(2)} / t
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
        <span className="text-sm font-medium text-slate-700">
          {title} rate
        </span>
        <span className="text-lg font-semibold text-charcoal">
          ${total.toFixed(2)} / t
        </span>
      </div>
    </div>
  );
}
