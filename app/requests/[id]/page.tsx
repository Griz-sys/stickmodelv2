"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatDate, formatRelativeTime, formatFileSize } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Upload,
  Video,
  DollarSign,
  ChevronDown,
  FolderOpen,
  CheckCircle,
  User,
  Calendar,
  Hash,
  Weight,
  StickyNote,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProjectStep {
  id: string;
  projectId: string;
  order: number;
  userLabel: string;
  userFileName: string | null;
  userFileUrl: string | null;
  userFileSize: number | null;
  userFileType: string | null;
  adminFileName: string | null;
  adminFileUrl: string | null;
  adminFileSize: number | null;
  adminFileType: string | null;
  cost: number | null;
  isPaid: boolean;
  datePayment: string | null;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  tonnage: number | null;
  dateUpload: string;
  dateFinish: string | null;
  cost: number | null;
  status: string;
  notes: string | null;
  videoUrl: string | null;
  userId: string;
  userFileName?: string | null;
  userFileUrl?: string | null;
  userFileSize?: number | null;
  userFileType?: string | null;
  adminFileName?: string | null;
  adminFileUrl?: string | null;
  adminFileSize?: number | null;
  adminFileType?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  steps: ProjectStep[];
}

const STATUS_OPTIONS = [
  {
    value: "uploaded",
    label: "Uploaded",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "in_progress",
    label: "In Progress",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    value: "issue",
    label: "Issue",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "finished",
    label: "Finished",
    color: "bg-green-100 text-green-700 border-green-200",
  },
];

export default function RequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // Video upload modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Admin status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Project-level price (initial submission)
  const [priceInput, setPriceInput] = useState("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  // Unified deliverable upload modal (initial submission OR a step)
  const [deliverableTarget, setDeliverableTarget] = useState<
    { type: "project" } | { type: "step"; stepId: string } | null
  >(null);
  const [deliverableFile, setDeliverableFile] = useState<File | null>(null);
  const [isUploadingDeliverable, setIsUploadingDeliverable] = useState(false);

  // Remove initial-submission deliverable
  const [isRemovingProjectDeliverable, setIsRemovingProjectDeliverable] =
    useState(false);

  // Add-step modal
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepLabel, setNewStepLabel] = useState("");
  const [newStepFile, setNewStepFile] = useState<File | null>(null);
  const [isCreatingStep, setIsCreatingStep] = useState(false);

  // Per-step price inputs
  const [stepPriceInputs, setStepPriceInputs] = useState<
    Record<string, string>
  >({});
  const [savingStepPrice, setSavingStepPrice] = useState<string | null>(null);

  // Remove step deliverable
  const [removingStepDeliverable, setRemovingStepDeliverable] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project?.cost !== undefined && project.cost !== null) {
      setPriceInput(String(project.cost));
    }
    if (project?.steps) {
      const prices: Record<string, string> = {};
      for (const s of project.steps) {
        if (s.cost !== null) prices[s.id] = String(s.cost);
      }
      setStepPriceInputs(prices);
    }
  }, [project?.cost, project?.steps]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else if (response.status === 404) {
        router.push(currentUser?.role === "admin" ? "/admin" : "/home");
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePay = async () => {
    setIsPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Payment functionality not yet implemented");
    setIsPaying(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return;
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          dateFinish:
            newStatus === "finished" ? new Date().toISOString() : undefined,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSetPrice = async () => {
    if (!project || !priceInput) return;
    const parsed = parseFloat(priceInput);
    if (isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid price.");
      return;
    }
    setIsSavingPrice(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cost: parsed }),
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error("Failed to set price:", error);
      alert("Failed to save price");
    } finally {
      setIsSavingPrice(false);
    }
  };

  // Shared deliverable upload handler (project-level OR a step)
  const handleUploadDeliverable = async () => {
    if (!project || !deliverableFile || !deliverableTarget) return;
    setIsUploadingDeliverable(true);
    try {
      const formData = new FormData();
      formData.append("file", deliverableFile);
      formData.append("projectId", project.id);
      formData.append("isAdminResponse", "true");
      const uploadRes = await fetch("/api/blob/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }
      const { url } = await uploadRes.json();

      if (deliverableTarget.type === "project") {
        const patchRes = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminFileName: deliverableFile.name,
            adminFileUrl: url,
            adminFileSize: deliverableFile.size,
            adminFileType: deliverableFile.type,
          }),
        });
        if (!patchRes.ok) throw new Error("Failed to save file info");
        const data = await patchRes.json();
        setProject(data.project);
      } else {
        const patchRes = await fetch(
          `/api/projects/${project.id}/steps/${deliverableTarget.stepId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              adminFileName: deliverableFile.name,
              adminFileUrl: url,
              adminFileSize: deliverableFile.size,
              adminFileType: deliverableFile.type,
            }),
          }
        );
        if (!patchRes.ok) throw new Error("Failed to save step file info");
        await fetchProject();
      }
      setDeliverableFile(null);
      setDeliverableTarget(null);
    } catch (error) {
      console.error("Deliverable upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingDeliverable(false);
    }
  };

  const handleRemoveProjectDeliverable = async () => {
    if (!project) return;
    setIsRemovingProjectDeliverable(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminFileName: null,
          adminFileUrl: null,
          adminFileSize: null,
          adminFileType: null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error("Remove project deliverable failed:", error);
    } finally {
      setIsRemovingProjectDeliverable(false);
    }
  };

  const handleRemoveStepDeliverable = async (stepId: string) => {
    if (!project) return;
    setRemovingStepDeliverable(stepId);
    try {
      const res = await fetch(
        `/api/projects/${project.id}/steps/${stepId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove deliverable");
      await fetchProject();
    } catch (error) {
      console.error("Remove step deliverable failed:", error);
      alert(error instanceof Error ? error.message : "Failed to remove deliverable");
    } finally {
      setRemovingStepDeliverable(null);
    }
  };

  const handleSetStepPrice = async (stepId: string) => {
    if (!project) return;
    const val = stepPriceInputs[stepId];
    if (!val) return;
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid price.");
      return;
    }
    setSavingStepPrice(stepId);
    try {
      const res = await fetch(
        `/api/projects/${project.id}/steps/${stepId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cost: parsed }),
        }
      );
      if (!res.ok) throw new Error("Failed to save price");
      await fetchProject();
    } catch (error) {
      console.error("Set step price failed:", error);
      alert(error instanceof Error ? error.message : "Failed to save price");
    } finally {
      setSavingStepPrice(null);
    }
  };

  const handleAddStep = async () => {
    if (!project || !newStepLabel.trim()) return;
    setIsCreatingStep(true);
    try {
      // 1. Create the step record
      const createRes = await fetch(`/api/projects/${project.id}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userLabel: newStepLabel.trim() }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create step");
      }
      const { step } = await createRes.json();

      // 2. Upload file if selected
      if (newStepFile) {
        const formData = new FormData();
        formData.append("file", newStepFile);
        formData.append("projectId", project.id);
        formData.append("isAdminResponse", "false");
        const uploadRes = await fetch("/api/blob/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Failed to upload file");
        }
        const { url } = await uploadRes.json();

        await fetch(`/api/projects/${project.id}/steps/${step.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userFileName: newStepFile.name,
            userFileUrl: url,
            userFileSize: newStepFile.size,
            userFileType: newStepFile.type,
          }),
        });
      }

      await fetchProject();
      setNewStepLabel("");
      setNewStepFile(null);
      setShowAddStepModal(false);
    } catch (error) {
      console.error("Add step failed:", error);
      alert(error instanceof Error ? error.message : "Failed to add step");
    } finally {
      setIsCreatingStep(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!project || !videoFile) return;
    setIsUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("projectId", project.id);
      formData.append("isAdminResponse", "true");
      const uploadRes = await fetch("/api/blob/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Failed to upload video");
      }
      const { url: publicUrl } = await uploadRes.json();

      // Step 2: Save video URL on the project record
      const patchRes = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: publicUrl }),
      });

      if (patchRes.ok) {
        const data = await patchRes.json();
        setProject(data.project);
      }

      setVideoFile(null);
      setShowVideoModal(false);
    } catch (error) {
      console.error("Video upload failed:", error);
      alert(error instanceof Error ? error.message : "Failed to upload video");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const isAdmin = currentUser?.role === "admin";
  const backUrl = isAdmin ? "/admin" : "/home";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(
    (s) => s.value === project?.status,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            This project does not exist or you don't have access.
          </p>
          <Link href={backUrl}>
            <Button>Return {isAdmin ? "to Admin" : "to Home"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFinished = project.status === "finished";
  const isInProgress = project.status === "in_progress";
  const isUploaded = project.status === "uploaded";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + back breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <img src="/logo.svg" alt="StickModel" className="h-10 w-auto" />
              <span className="font-semibold text-slate-900">StickModel</span>
            </Link>
            <span className="text-slate-300 text-lg">/</span>
            <Link
              href={backUrl}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {isAdmin ? "Admin" : "My Projects"}
            </Link>
            <span className="text-slate-300 text-lg">/</span>
            <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
              {project.name}
            </span>
          </div>

          {/* Right: status badge + logout */}
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status as any} />
            {isAdmin && (
              <span className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                Admin View
              </span>
            )}
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {project.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {project.user?.name || "Unknown User"}{" "}
              {project.user?.email ? `· ${project.user.email}` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Uploaded {formatRelativeTime(new Date(project.dateUpload))}
            </span>
            {project.dateFinish && (
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Finished {formatDate(new Date(project.dateFinish))}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ======== LEFT / MAIN COLUMN ======== */}
          <div className="lg:col-span-2 space-y-6">
            {/* ---- Admin Controls ---- */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block" />
                      Admin Controls
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Status Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Project Status
                      </label>
                      <div className="relative">
                        <select
                          value={project.status}
                          onChange={(e) => handleStatusUpdate(e.target.value)}
                          disabled={isUpdatingStatus}
                          className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
                          {isUpdatingStatus ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                      {currentStatusOption && (
                        <div
                          className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${currentStatusOption.color}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          Currently: {currentStatusOption.label}
                        </div>
                      )}
                    </div>

                    {/* Upload Video */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Project Video
                      </label>
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-slate-300 hover:border-purple-400 hover:bg-purple-50 text-sm font-medium text-slate-600 hover:text-purple-600 transition-all"
                      >
                        <Video className="w-4 h-4" />
                        {project.videoUrl ? "Replace Video" : "Upload Video"}
                      </button>
                      {project.videoUrl && (
                        <p className="mt-1.5 text-xs text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Video uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---- Status info (users) ---- */}
            {!isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
                  <h2 className="text-base font-semibold text-slate-900 mb-4">
                    Project Status
                  </h2>
                  {isUploaded && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-0.5">
                          Project received
                        </p>
                        <p className="text-sm text-blue-700">
                          We'll start processing soon. You'll be notified when
                          it's ready.
                        </p>
                      </div>
                    </div>
                  )}
                  {isInProgress && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <Loader2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 animate-spin" />
                      <div>
                        <p className="font-semibold text-orange-900 mb-0.5">
                          Work in progress
                        </p>
                        <p className="text-sm text-orange-700">
                          Your project is currently being processed. Check back
                          soon.
                        </p>
                      </div>
                    </div>
                  )}
                  {isFinished && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 mb-0.5">
                          Project ready!
                        </p>
                        <p className="text-sm text-green-700">
                          Download your files below.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ---- Steps Section ---- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block" />
                    {isAdmin ? "Project Steps" : "Your Steps"}
                  </h2>
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 font-medium">
                    {1 + (project.steps?.length ?? 0)} step
                    {1 + (project.steps?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  {/* ── Initial Submission (project-level fields) ── */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Initial Submission
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(new Date(project.dateUpload))}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      {/* User file */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                          Uploaded File
                        </p>
                        {project.userFileName && project.userFileUrl ? (
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-800 truncate">
                                {project.userFileName}
                              </span>
                              {project.userFileSize && (
                                <span className="text-xs text-slate-400 flex-shrink-0">
                                  {formatFileSize(project.userFileSize)}
                                </span>
                              )}
                            </div>
                            <a
                              href={project.userFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-700 hover:text-blue-600 transition-all flex-shrink-0 ml-2"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </a>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-400">
                            No file uploaded
                          </div>
                        )}
                      </div>

                      {/* Admin deliverable */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                          Deliverable
                        </p>
                        {project.adminFileName && project.adminFileUrl ? (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-800 truncate">
                                {project.adminFileName}
                              </span>
                              {project.adminFileSize && (
                                <span className="text-xs text-slate-400 flex-shrink-0">
                                  {formatFileSize(project.adminFileSize)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <a
                                href={project.adminFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-green-400 hover:bg-green-50 text-xs font-medium text-slate-700 hover:text-green-600 transition-all"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </a>
                              {isAdmin && (
                                <button
                                  onClick={handleRemoveProjectDeliverable}
                                  disabled={isRemovingProjectDeliverable}
                                  title="Remove deliverable"
                                  className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-all"
                                >
                                  {isRemovingProjectDeliverable ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <span className="text-sm text-slate-400">
                              No deliverable yet
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  setDeliverableTarget({ type: "project" })
                                }
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium transition-all"
                              >
                                <Upload className="w-3 h-3" />
                                Upload
                              </button>
                            )}
                          </div>
                        )}
                        {isAdmin && project.adminFileName && (
                          <button
                            onClick={() =>
                              setDeliverableTarget({ type: "project" })
                            }
                            className="mt-1.5 text-xs text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2"
                          >
                            Replace deliverable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Additional Steps ── */}
                  {project.steps?.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-xl border border-slate-200 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Step {step.order} ·{" "}
                          <span className="text-orange-600 normal-case">
                            {step.userLabel}
                          </span>
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatRelativeTime(new Date(step.createdAt))}
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* User file */}
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Uploaded File
                          </p>
                          {step.userFileName && step.userFileUrl ? (
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-800 truncate">
                                  {step.userFileName}
                                </span>
                                {step.userFileSize && (
                                  <span className="text-xs text-slate-400 flex-shrink-0">
                                    {formatFileSize(step.userFileSize)}
                                  </span>
                                )}
                              </div>
                              <a
                                href={step.userFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-700 hover:text-blue-600 transition-all flex-shrink-0 ml-2"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </a>
                            </div>
                          ) : (
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-400">
                              No file uploaded
                            </div>
                          )}
                        </div>

                        {/* Admin deliverable */}
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Deliverable
                          </p>
                          {step.adminFileName && step.adminFileUrl ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-800 truncate">
                                  {step.adminFileName}
                                </span>
                                {step.adminFileSize && (
                                  <span className="text-xs text-slate-400 flex-shrink-0">
                                    {formatFileSize(step.adminFileSize)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <a
                                  href={step.adminFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-green-400 hover:bg-green-50 text-xs font-medium text-slate-700 hover:text-green-600 transition-all"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </a>
                                {isAdmin && (
                                  <button
                                    onClick={() =>
                                      handleRemoveStepDeliverable(step.id)
                                    }
                                    disabled={
                                      removingStepDeliverable === step.id
                                    }
                                    title="Remove deliverable"
                                    className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-all"
                                  >
                                    {removingStepDeliverable === step.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                              <span className="text-sm text-slate-400">
                                No deliverable yet
                              </span>
                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    setDeliverableTarget({
                                      type: "step",
                                      stepId: step.id,
                                    })
                                  }
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium transition-all"
                                >
                                  <Upload className="w-3 h-3" />
                                  Upload
                                </button>
                              )}
                            </div>
                          )}
                          {isAdmin && step.adminFileName && (
                            <button
                              onClick={() =>
                                setDeliverableTarget({
                                  type: "step",
                                  stepId: step.id,
                                })
                              }
                              className="mt-1.5 text-xs text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2"
                            >
                              Replace deliverable
                            </button>
                          )}
                        </div>

                        {/* Per-step price/payment */}
                        {isAdmin ? (
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                              Step Price
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={stepPriceInputs[step.id] ?? ""}
                                  onChange={(e) =>
                                    setStepPriceInputs((prev) => ({
                                      ...prev,
                                      [step.id]: e.target.value,
                                    }))
                                  }
                                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                                />
                              </div>
                              <button
                                onClick={() => handleSetStepPrice(step.id)}
                                disabled={
                                  savingStepPrice === step.id ||
                                  !stepPriceInputs[step.id]
                                }
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold transition-all"
                              >
                                {savingStepPrice === step.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <DollarSign className="w-3.5 h-3.5" />
                                )}
                                Save
                              </button>
                            </div>
                            {step.cost !== null && (
                              <p className="mt-1.5 text-xs text-green-700 font-medium">
                                Current: ${step.cost.toLocaleString()}
                              </p>
                            )}
                          </div>
                        ) : step.cost !== null && step.adminFileUrl ? (
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div>
                              <p className="text-xs text-orange-700 font-medium mb-0.5">
                                Payment Due
                              </p>
                              <p className="text-xl font-bold text-orange-900">
                                ${step.cost.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={handlePay}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-all"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Pay Now
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {/* ── Add New Step button (always visible) ── */}
                  <button
                    onClick={() => setShowAddStepModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50 text-sm font-medium text-slate-500 hover:text-orange-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    {isAdmin ? "Add Step (on behalf of client)" : "Add New Step"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ---- Video ---- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-purple-500 rounded-full inline-block" />
                    Project Video
                  </h2>
                </div>
                <div className="p-6">
                  {project.videoUrl ? (
                    <div className="rounded-xl overflow-hidden bg-slate-900">
                      <video
                        controls
                        className="w-full aspect-video"
                        src={project.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
                      <Video className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 font-medium">
                        No video uploaded yet
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() => setShowVideoModal(true)}
                          className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
                        >
                          Upload a video
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            {project.notes && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-yellow-400 rounded-full inline-block" />
                      Client Notes
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {project.notes}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ======== RIGHT / SIDEBAR ======== */}
          <div className="space-y-5">
            {/* ---- Project Details ---- */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                    Project Details
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Hash className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">
                        Project ID
                      </p>
                      <p className="text-xs font-mono text-slate-800 break-all">
                        {project.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">
                        Client
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {project.user?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {project.user?.email || ""}
                      </p>
                    </div>
                  </div>
                  {project.tonnage !== null && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Weight className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">
                          {project.tonnage === 0
                            ? "Bill of Materials"
                            : "Tonnage"}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {project.tonnage === 0
                            ? "Requested"
                            : `${project.tonnage} tons`}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">
                        Uploaded
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(new Date(project.dateUpload))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ---- Set Price (Admin) ---- */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Set Project Price
                    </h2>
                  </div>
                  <div className="p-5">
                    {project.cost !== null && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                        <p className="text-xs text-green-700 font-medium mb-0.5">
                          Current Price
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          ${project.cost.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className="relative mb-3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSetPrice}
                      disabled={isSavingPrice || !priceInput}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold transition-all shadow-sm"
                    >
                      {isSavingPrice ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          {project.cost !== null ? "Update Price" : "Set Price"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---- Payment (User view, if finished) ---- */}
            {!isAdmin && isFinished && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      Payment
                    </h2>
                  </div>
                  <div className="p-5">
                    {project.cost ? (
                      <div className="mb-5 text-center">
                        <p className="text-xs text-slate-500 mb-1">
                          Total Amount Due
                        </p>
                        <p className="text-4xl font-bold text-slate-900">
                          ${project.cost.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-5 p-3 bg-slate-50 rounded-xl text-center">
                        <p className="text-sm text-slate-500">
                          Cost to be determined
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handlePay}
                      disabled={isPaying}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold transition-all shadow-sm"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-400 mt-3 text-center">
                      Payment processing not yet implemented
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---- Summary Stats ---- */}
          </div>
        </div>
      </div>

      {/* ---- Deliverable Upload Modal (project or step) ---- */}
      {isAdmin && (
        <Modal
          isOpen={deliverableTarget !== null}
          onClose={() => {
            setDeliverableTarget(null);
            setDeliverableFile(null);
          }}
          title="Upload Deliverable File"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0])
                    setDeliverableFile(e.target.files[0]);
                }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {deliverableFile && (
                <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {deliverableFile.name} (
                  {(deliverableFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setDeliverableTarget(null);
                  setDeliverableFile(null);
                }}
                variant="secondary"
                className="flex-1"
                disabled={isUploadingDeliverable}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadDeliverable}
                disabled={!deliverableFile || isUploadingDeliverable}
                className="flex-1 gap-2"
              >
                {isUploadingDeliverable ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---- Add New Step Modal ---- */}
      <Modal
        isOpen={showAddStepModal}
        onClose={() => {
          setShowAddStepModal(false);
          setNewStepLabel("");
          setNewStepFile(null);
        }}
        title="Add New Step"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Step Label <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={newStepLabel}
              onChange={(e) => setNewStepLabel(e.target.value)}
              placeholder="e.g. Level 2 Foundation Plans"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              File{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) setNewStepFile(e.target.files[0]);
              }}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {newStepFile && (
              <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                {newStepFile.name} (
                {(newStepFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                setShowAddStepModal(false);
                setNewStepLabel("");
                setNewStepFile(null);
              }}
              variant="secondary"
              className="flex-1"
              disabled={isCreatingStep}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStep}
              disabled={!newStepLabel.trim() || isCreatingStep}
              className="flex-1 gap-2"
            >
              {isCreatingStep ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Step
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ---- Video Upload Modal ---- */}
      {isAdmin && (
        <Modal
          isOpen={showVideoModal}
          onClose={() => {
            setShowVideoModal(false);
            setVideoFile(null);
          }}
          title="Upload Project Video"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Select Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setVideoFile(e.target.files[0]);
                }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {videoFile && (
                <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                  <Video className="w-4 h-4 text-slate-400" />
                  {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoFile(null);
                }}
                variant="secondary"
                className="flex-1"
                disabled={isUploadingVideo}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVideoUpload}
                disabled={!videoFile || isUploadingVideo}
                className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
              >
                {isUploadingVideo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Upload Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
