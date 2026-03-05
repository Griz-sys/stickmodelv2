"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Users,
  FolderKanban,
  Upload,
  Download,
  Clock,
  CheckCircle,
  Search,
  RefreshCw,
  FileText,
  Loader2,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    projects: number;
  };
}

interface Project {
  id: string;
  name: string;
  tonnage: number | null;
  dateUpload: string;
  dateFinish: string | null;
  cost: number | null;
  status: string;
  userId: string | null;
  videoUrl: string | null;
  notes: string | null;
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

interface Submission {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
  description: string | null;
}

type Tab = "projects" | "users";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Project modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Video upload state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "projects") {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedProject) return;

    // Validate that files and video are uploaded before marking as finished
    if (status === "finished") {
      if (!selectedProject.adminFileUrl) {
        alert(
          "Please upload the admin deliverable file before marking as finished.",
        );
        return;
      }
      if (!selectedProject.videoUrl) {
        alert("Please upload the project video before marking as finished.");
        return;
      }
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          dateFinish:
            status === "finished" ? new Date().toISOString() : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedProject(data.project);
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmission = async () => {
    if (!selectedProject || !uploadFile) return;

    setIsUploading(true);
    try {
      // Upload admin deliverable file to Vercel Blob using project-based path
      const { upload } = await import("@vercel/blob/client");

      const blob = await upload(uploadFile.name, uploadFile, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({
          projectId: selectedProject.id,
          isAdminResponse: true,
          fileName: uploadFile.name,
        }),
      });

      // Patch project with admin file metadata + URL
      const updateResponse = await fetch(
        `/api/projects/${selectedProject.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminFileName: uploadFile.name,
            adminFileUrl: blob.url,
            adminFileSize: uploadFile.size,
            adminFileType: uploadFile.type || "application/pdf",
          }),
        },
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData.error || "Failed to update project with admin file",
        );
      }

      const projectData = await updateResponse.json();
      setSelectedProject(projectData.project);
      fetchData();

      // Reset form
      setUploadFile(null);
      setUploadDescription("");
      setShowUploadModal(false);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (submissionId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/download`);
      const data = await response.json();

      if (response.ok && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedProject || !videoFile) return;

    setIsUploadingVideo(true);
    try {
      // Upload video to Vercel Blob
      const { upload } = await import("@vercel/blob/client");

      const blob = await upload(videoFile.name, videoFile, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({
          projectId: selectedProject.id,
          isAdminResponse: true,
          fileName: videoFile.name,
        }),
      });

      // Update project with video URL
      await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: blob.url,
        }),
      });

      // Refresh project data
      const projectResponse = await fetch(
        `/api/projects/${selectedProject.id}`,
      );
      const projectData = await projectResponse.json();
      setSelectedProject(projectData.project);

      // Reset form
      setVideoFile(null);
      setShowVideoModal(false);
      fetchData(); // Refresh the list
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Video upload failed:", error);
      alert("Failed to upload video");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(
      (p) => p.status === "uploaded" || p.status === "in_progress",
    ).length,
    finishedProjects: projects.filter((p) => p.status === "finished").length,
    totalUsers: users.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ==================== HEADER ==================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-base text-slate-500 mt-2 font-medium">
                Manage all projects, users, and submissions in one place
              </p>
            </div>
          </div>
        </motion.div>

        {/* ==================== STATS CARDS ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
        >
          {/* Total Projects */}
          <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium tracking-wide">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.totalProjects}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <FolderKanban className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 relative z-10">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>All time</span>
            </div>
          </div>

          {/* Active Projects */}
          <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium tracking-wide">
                  Active
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.activeProjects}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 relative z-10">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>In progress</span>
            </div>
          </div>

          {/* Finished Projects */}
          <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium tracking-wide">
                  Finished
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.finishedProjects}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 relative z-10">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Completed</span>
            </div>
          </div>

          {/* Total Users */}
          <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium tracking-wide">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 relative z-10">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Registered</span>
            </div>
          </div>
        </motion.div>

        {/* ==================== TABS & CONTROLS ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6 mb-8"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 border-b border-slate-200 w-full">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-300 relative ${
                  activeTab === "projects"
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" />
                  Projects
                </span>
                {activeTab === "projects" && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-300 relative ${
                  activeTab === "users"
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </span>
                {activeTab === "users" && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <Input
                type="text"
                placeholder={`Search ${activeTab === "projects" ? "projects by name" : "users by name or email"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
              />
            </div>
            <Button
              onClick={fetchData}
              variant="secondary"
              className="gap-2 px-4 py-2.5 h-auto border-slate-200 hover:bg-slate-100 text-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </motion.div>

        {/* ==================== CONTENT ==================== */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-24"
          >
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading data...</p>
            </div>
          </motion.div>
        ) : activeTab === "projects" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {filteredProjects.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleProjectClick(project)}
                    className="p-6 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-base font-semibold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                            {project.name}
                          </h3>
                          <StatusBadge status={project.status as any} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                          <div>
                            <p className="text-slate-500 font-medium mb-1">
                              Client
                            </p>
                            <p className="text-slate-900 font-medium">
                              {project.user?.name || "Unassigned"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 font-medium mb-1">
                              Scope
                            </p>
                            <p className="text-slate-900 font-medium">
                              {project.tonnage === null ? (
                                "N/A"
                              ) : project.tonnage === 0 ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  BOM
                                </span>
                              ) : (
                                `${project.tonnage} tons`
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 font-medium mb-1">
                              Cost
                            </p>
                            <p className="text-slate-900 font-medium">
                              {project.cost
                                ? `$${project.cost.toLocaleString()}`
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 font-medium mb-1">
                              Uploaded
                            </p>
                            <p className="text-slate-900 font-medium">
                              {new Date(project.dateUpload).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4"
                        >
                          Open
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed"
              >
                <FolderKanban className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">
                  {searchQuery
                    ? "No projects found"
                    : "No projects yet"}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredUsers.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                {filteredUsers.map((user, idx) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="inline-flex items-center gap-2">
                            <div
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {user.role === "admin" ? "👑 Admin" : "User"}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <FolderKanban className="w-4 h-4 text-slate-400" />
                            <span>
                              {user._count.projects}{" "}
                              {user._count.projects === 1
                                ? "project"
                                : "projects"}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed"
              >
                <Users className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">
                  {searchQuery ? "No users found" : "No users yet"}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          isOpen={showProjectModal}
          onClose={() => {
            setShowProjectModal(false);
            setSelectedProject(null);
          }}
          title={selectedProject.name}
        >
          <div className="space-y-8">
            {/* Status & Meta Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                    Status
                  </p>
                  <div className="inline-flex">
                    <StatusBadge status={selectedProject.status as any} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                    User
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedProject.user?.name || "Unassigned"}
                  </p>
                </div>
              </div>

              {(selectedProject.tonnage !== null || selectedProject.cost) && (
                <div className="grid grid-cols-2 gap-6">
                  {selectedProject.tonnage !== null && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                        Scope
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {selectedProject.tonnage === 0
                          ? "Bill of Materials requested"
                          : `${selectedProject.tonnage} tons`}
                      </p>
                    </div>
                  )}
                  {selectedProject.cost && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                        Cost
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        ${selectedProject.cost.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedProject.notes && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                    User Notes
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedProject.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Status Dropdown */}
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3 block">
                Project Status
              </label>
              <select
                value={selectedProject.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={isUpdating}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
              >
                <option value="in queue">In Queue</option>
                <option value="in_progress">In Progress</option>
                <option value="issue">Issue</option>
                <option
                  value="finished"
                  disabled={
                    !selectedProject.adminFileUrl || !selectedProject.videoUrl
                  }
                >
                  Finished{" "}
                  {!selectedProject.adminFileUrl || !selectedProject.videoUrl
                    ? "(Upload files & video first)"
                    : ""}
                </option>
              </select>
              {selectedProject.status !== "finished" &&
                (!selectedProject.adminFileUrl ||
                  !selectedProject.videoUrl) && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-xs text-yellow-800">
                      Upload admin file and video before marking as finished
                    </p>
                  </div>
                )}
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Video Upload Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                    Project Video
                  </p>
                  {selectedProject.videoUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Uploaded
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setShowVideoModal(true)}
                  size="sm"
                  className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  {selectedProject.videoUrl ? "Replace" : "Upload"}
                </Button>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                {selectedProject.videoUrl ? (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        Video uploaded successfully
                      </p>
                      <a
                        href={selectedProject.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1 hover:underline transition-all"
                      >
                        View Video
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-0.5">
                        No video uploaded
                      </p>
                      <p className="text-xs text-slate-600">
                        Required to mark project as finished
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Files (User upload + Admin deliverable) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                    Project Files
                  </p>
                  {selectedProject.adminFileUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Deliverable Ready
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  size="sm"
                  className="gap-2 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  {selectedProject.adminFileUrl
                    ? "Replace"
                    : "Upload Admin File"}
                </Button>
              </div>

              <div className="space-y-3">
                {selectedProject.userFileName &&
                  selectedProject.userFileUrl && (
                    <div className="group p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 mb-0.5 truncate">
                              {selectedProject.userFileName}
                            </p>
                            <p className="text-xs text-slate-500">
                              User upload
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedProject.userFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 transition-all"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                        </a>
                      </div>
                    </div>
                  )}

                {selectedProject.adminFileName &&
                  selectedProject.adminFileUrl && (
                    <div className="group p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 mb-0.5 truncate">
                              {selectedProject.adminFileName}
                            </p>
                            <p className="text-xs text-green-700 font-medium">
                              Admin deliverable - Ready for client
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedProject.adminFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-600 hover:bg-amber-700 transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>
                  )}

                {!selectedProject.adminFileName && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 mb-0.5">
                          No admin deliverable uploaded
                        </p>
                        <p className="text-xs text-slate-600">
                          Admin file is required to mark project as finished
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadFile(null);
          setUploadDescription("");
        }}
        title="Upload File to Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {uploadFile && (
              <p className="mt-2 text-sm text-slate-600">
                {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-900 mb-2"
            >
              Description (Optional)
            </label>
            <Input
              id="description"
              type="text"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              placeholder="Add a note about this file..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                setShowUploadModal(false);
                setUploadFile(null);
                setUploadDescription("");
              }}
              variant="secondary"
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmission}
              disabled={!uploadFile || isUploading}
              className="flex-1 gap-2"
            >
              {isUploading ? (
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

      {/* Video Upload Modal */}
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
                if (e.target.files && e.target.files[0]) {
                  setVideoFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {videoFile && (
              <p className="mt-2 text-sm text-slate-600">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
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
                  <Upload className="w-4 h-4" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
