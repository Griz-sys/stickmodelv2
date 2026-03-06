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
}

const STATUS_OPTIONS = [
  { value: "uploaded", label: "Uploaded", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "in_progress", label: "In Progress", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "issue", label: "Issue", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "finished", label: "Finished", color: "bg-green-100 text-green-700 border-green-200" },
];

export default function RequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // Admin upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Admin video upload states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Admin status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Price setting
  const [priceInput, setPriceInput] = useState("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project?.cost !== undefined && project.cost !== null) {
      setPriceInput(String(project.cost));
    }
  }, [project?.cost]);

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

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
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
          dateFinish: newStatus === "finished" ? new Date().toISOString() : undefined,
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

  const handleFileUpload = async () => {
    if (!project || !uploadFile) return;
    setIsUploading(true);
    try {
      // Step 1: Upload file to server (which uploads to DigitalOcean Spaces)
      const uploadRes = await fetch("/api/blob/upload", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append('file', uploadFile);
          formData.append('projectId', project.id);
          formData.append('isAdminResponse', 'true');
          return formData;
        })(),
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Failed to upload file");
      }

      const { url: publicUrl } = await uploadRes.json();

      // Step 2: Save file info on the project record
      const patchRes = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminFileName: uploadFile.name,
          adminFileUrl: publicUrl,
          adminFileSize: uploadFile.size,
          adminFileType: uploadFile.type,
        }),
      });
      if (!patchRes.ok) {
        const err = await patchRes.json();
        throw new Error(err.error || "Failed to save file info");
      }

      await fetchProject();
      setUploadFile(null);
      setUploadDescription("");
      setShowUploadModal(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!project || !videoFile) return;
    setIsUploadingVideo(true);
    try {
      // Step 1: Upload video to server (which uploads to DigitalOcean Spaces)
      const uploadRes = await fetch("/api/blob/upload", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append('file', videoFile);
          formData.append('projectId', project.id);
          formData.append('isAdminResponse', 'true');
          return formData;
        })(),
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

  const currentStatusOption = STATUS_OPTIONS.find((s) => s.value === project?.status);

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
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-6">This project does not exist or you don't have access.</p>
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
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
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
              {project.user?.name || "Unknown User"} {project.user?.email ? `· ${project.user.email}` : ""}
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
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block" />
                      Admin Controls
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">

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
                        <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${currentStatusOption.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          Currently: {currentStatusOption.label}
                        </div>
                      )}
                    </div>

                    {/* Upload Finished File */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Deliverable File
                      </label>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50 text-sm font-medium text-slate-600 hover:text-orange-600 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        {project.adminFileName ? "Replace File" : "Upload File"}
                      </button>
                      {project.adminFileName && (
                        <p className="mt-1.5 text-xs text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {project.adminFileName}
                        </p>
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
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
                  <h2 className="text-base font-semibold text-slate-900 mb-4">Project Status</h2>
                  {isUploaded && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-0.5">Project received</p>
                        <p className="text-sm text-blue-700">We'll start processing soon. You'll be notified when it's ready.</p>
                      </div>
                    </div>
                  )}
                  {isInProgress && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <Loader2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 animate-spin" />
                      <div>
                        <p className="font-semibold text-orange-900 mb-0.5">Work in progress</p>
                        <p className="text-sm text-orange-700">Your project is currently being processed. Check back soon.</p>
                      </div>
                    </div>
                  )}
                  {isFinished && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 mb-0.5">Project ready!</p>
                        <p className="text-sm text-green-700">Download your files below.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ---- User Uploaded Files ---- */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
                    {isAdmin ? "Client Uploaded Files" : "Your Uploaded Files"}
                  </h2>
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 font-medium">
                    {project.userFileName ? "1 file" : "0 files"}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {project.userFileName && project.userFileUrl ? (
                    <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">{project.userFileName}</p>
                          {project.userFileSize && (
                            <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(project.userFileSize)}</p>
                          )}
                        </div>
                      </div>
                      <a
                        href={project.userFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FolderOpen className="w-10 h-10 text-slate-200 mb-3" />
                      <p className="text-sm text-slate-500 font-medium">No files uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ---- Admin Deliverables ---- */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-green-500 rounded-full inline-block" />
                    {isAdmin ? "Deliverables (Admin Uploads)" : "Final Deliverables"}
                  </h2>
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 font-medium">
                    {project.adminFileName ? "1 file" : "0 files"}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {project.adminFileName && project.adminFileUrl ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-all group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">{project.adminFileName}</p>
                          {project.adminFileSize && (
                            <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(project.adminFileSize)}</p>
                          )}
                        </div>
                      </div>
                      {(isAdmin || isFinished) && (
                        <button
                          onClick={() => handleDownload(project.adminFileUrl!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-all shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Upload className="w-10 h-10 text-slate-200 mb-3" />
                      <p className="text-sm text-slate-500 font-medium">No deliverables uploaded yet</p>
                      {isAdmin && (
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2"
                        >
                          Upload a file
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ---- Video ---- */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                      <video controls className="w-full aspect-video" src={project.videoUrl}>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
                      <Video className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 font-medium">No video uploaded yet</p>
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

            {/* ---- Notes ---- */}
            {project.notes && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-yellow-400 rounded-full inline-block" />
                      Client Notes
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{project.notes}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ======== RIGHT / SIDEBAR ======== */}
          <div className="space-y-5">

            {/* ---- Project Details ---- */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Project Details</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Hash className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">Project ID</p>
                      <p className="text-xs font-mono text-slate-800 break-all">{project.id}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">Client</p>
                      <p className="text-sm font-semibold text-slate-900">{project.user?.name || "—"}</p>
                      <p className="text-xs text-slate-500">{project.user?.email || ""}</p>
                    </div>
                  </div>
                  {project.tonnage !== null && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Weight className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">
                          {project.tonnage === 0 ? "Bill of Materials" : "Tonnage"}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {project.tonnage === 0 ? "Requested" : `${project.tonnage} tons`}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">Uploaded</p>
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
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
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
                        <p className="text-xs text-green-700 font-medium mb-0.5">Current Price</p>
                        <p className="text-2xl font-bold text-green-800">${project.cost.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="relative mb-3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
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
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Payment</h2>
                  </div>
                  <div className="p-5">
                    {project.cost ? (
                      <div className="mb-5 text-center">
                        <p className="text-xs text-slate-500 mb-1">Total Amount Due</p>
                        <p className="text-4xl font-bold text-slate-900">${project.cost.toLocaleString()}</p>
                      </div>
                    ) : (
                      <div className="mb-5 p-3 bg-slate-50 rounded-xl text-center">
                        <p className="text-sm text-slate-500">Cost to be determined</p>
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
                    <p className="text-xs text-slate-400 mt-3 text-center">Payment processing not yet implemented</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---- Summary Stats ---- */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{project.userFileName ? 1 : 0}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Client Files</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{project.adminFileName ? 1 : 0}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Deliverables</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm col-span-2">
                  <p className={`text-2xl font-bold ${project.videoUrl ? "text-green-600" : "text-slate-300"}`}>
                    {project.videoUrl ? "✓" : "—"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Video</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ---- File Upload Modal ---- */}
      {isAdmin && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => { setShowUploadModal(false); setUploadFile(null); setUploadDescription(""); }}
          title="Upload Deliverable File"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Select File</label>
              <input
                type="file"
                onChange={(e) => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-2">
                Note (Optional)
              </label>
              <Input
                id="description"
                type="text"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="e.g. Final structural model v2"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadDescription(""); }}
                variant="secondary"
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleFileUpload} disabled={!uploadFile || isUploading} className="flex-1 gap-2">
                {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4" />Upload</>}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---- Video Upload Modal ---- */}
      {isAdmin && (
        <Modal
          isOpen={showVideoModal}
          onClose={() => { setShowVideoModal(false); setVideoFile(null); }}
          title="Upload Project Video"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Select Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => { if (e.target.files?.[0]) setVideoFile(e.target.files[0]); }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {videoFile && (
                <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                  <Video className="w-4 h-4 text-slate-400" />
                  {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => { setShowVideoModal(false); setVideoFile(null); }}
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
                {isUploadingVideo ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Video className="w-4 h-4" />Upload Video</>}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
