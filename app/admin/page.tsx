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
    <div className="min-h-screen bg-[#fafaf8] pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Manage users, projects, and submissions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Projects</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalProjects}
                  </p>
                </div>
                <FolderKanban className="w-10 h-10 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.activeProjects}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Finished</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.finishedProjects}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="border-b border-slate-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("projects")}
                className={`pb-4 px-1 border-b-2 transition-colors ${
                  activeTab === "projects"
                    ? "border-amber-500 text-slate-900 font-semibold"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`pb-4 px-1 border-b-2 transition-colors ${
                  activeTab === "users"
                    ? "border-amber-500 text-slate-900 font-semibold"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Users
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={fetchData} variant="secondary" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : activeTab === "projects" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          {project.name}
                        </h3>
                        <StatusBadge status={project.status as any} />
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <span>User: {project.user?.name || "Unassigned"}</span>
                        {project.tonnage === 0 ? (
                          <span>Bill of Materials requested</span>
                        ) : (
                          project.tonnage && <span>{project.tonnage} tons</span>
                        )}
                        {project.cost && (
                          <span>${project.cost.toLocaleString()}</span>
                        )}
                        <span>
                          Uploaded:{" "}
                          {new Date(project.dateUpload).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No projects found
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {user.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-md ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-slate-600">
                          {user._count.projects} projects
                        </span>
                        <span className="text-slate-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No users found
              </div>
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
