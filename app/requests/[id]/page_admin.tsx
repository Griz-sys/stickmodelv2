"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
  Play,
  Upload,
  Video,
} from "lucide-react";
import { upload } from "@vercel/blob/client";

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
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  submissions: Submission[];
}

interface Submission {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
  description: string | null;
  s3Url: string | null;
}

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

  useEffect(() => {
    fetchCurrentUser();
    fetchProject();
  }, [id]);

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

  const handlePay = async () => {
    setIsPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Payment functionality not yet implemented");
    setIsPaying(false);
  };

  // Admin functions
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

  const handleFileUpload = async () => {
    if (!project || !uploadFile) return;

    setIsUploading(true);
    try {
      // Step 1: Create submission record
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          fileName: uploadFile.name,
          fileSize: uploadFile.size,
          fileType: uploadFile.type,
          description: uploadDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create submission");
      }

      // Step 2: Upload file to Vercel Blob
      const blob = await upload(uploadFile.name, uploadFile, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({
          customPath: data.uploadConfig.pathname,
        }),
      });

      // Step 3: Update submission with blob URL
      await fetch(`/api/submissions/${data.submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blobUrl: blob.url,
        }),
      });

      // Step 4: Refresh project
      await fetchProject();

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

  const handleVideoUpload = async () => {
    if (!project || !videoFile) return;

    setIsUploadingVideo(true);
    try {
      // Upload video to Vercel Blob
      const blob = await upload(videoFile.name, videoFile, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });

      // Update project with video URL
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: blob.url,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }

      setVideoFile(null);
      setShowVideoModal(false);
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Video upload failed:", error);
      alert("Failed to upload video");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const isAdmin = currentUser?.role === "admin";
  const backUrl = isAdmin ? "/admin" : "/home";

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            This project does not exist or you don't have access to it.
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

  // Separate submissions by uploader role
  const userSubmissions =
    project.submissions?.filter((s) => s.uploadedBy === "user") || [];
  const adminSubmissions =
    project.submissions?.filter((s) => s.uploadedBy === "admin") || [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back {isAdmin ? "to Admin Dashboard" : "to Projects"}
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>
                Uploaded {formatRelativeTime(new Date(project.dateUpload))}
              </span>
              {project.dateFinish && (
                <>
                  <span>•</span>
                  <span>
                    Finished {formatDate(new Date(project.dateFinish))}
                  </span>
                </>
              )}
              {isAdmin && project.user && (
                <>
                  <span>•</span>
                  <span>User: {project.user.name}</span>
                </>
              )}
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Controls */}
          {isAdmin && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Admin Controls
                </h2>

                {/* Status Update */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Update Status
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={() => handleStatusUpdate("uploaded")}
                      disabled={
                        isUpdatingStatus || project.status === "uploaded"
                      }
                      variant="secondary"
                      size="sm"
                    >
                      Uploaded
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate("in_progress")}
                      disabled={
                        isUpdatingStatus || project.status === "in_progress"
                      }
                      variant="secondary"
                      size="sm"
                      className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300"
                    >
                      In Progress
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate("finished")}
                      disabled={
                        isUpdatingStatus || project.status === "finished"
                      }
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Finished
                    </Button>
                  </div>
                </div>

                {/* Upload Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    size="sm"
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </Button>
                  {!project.videoUrl && (
                    <Button
                      onClick={() => setShowVideoModal(true)}
                      size="sm"
                      className="gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Video className="w-4 h-4" />
                      Upload Video
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Info (for users) */}
          {!isAdmin && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Status
                </h2>

                {isUploaded && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">
                        Your project has been received
                      </p>
                      <p className="text-sm text-blue-700">
                        We'll start processing your project soon. You'll be
                        notified when it's ready.
                      </p>
                    </div>
                  </div>
                )}

                {isInProgress && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <Loader2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 animate-spin" />
                    <div>
                      <p className="font-medium text-orange-900 mb-1">
                        Work in progress
                      </p>
                      <p className="text-sm text-orange-700">
                        Your project is currently being processed. Check back
                        soon for updates.
                      </p>
                    </div>
                  </div>
                )}

                {isFinished && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 mb-1">
                        Your project is ready!
                      </p>
                      <p className="text-sm text-green-700">
                        Download your files below. Payment is required to access
                        all deliverables.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Video Section */}
          {project.videoUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Video
                </h2>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full aspect-video"
                    src={project.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Uploaded Files (by user) */}
          {userSubmissions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {isAdmin ? "User's Uploaded Files" : "Your Uploaded Files"}
                </h2>
                <div className="space-y-3">
                  {userSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-slate-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {submission.fileName}
                          </p>
                          <p className="text-xs text-slate-600">
                            {formatFileSize(submission.fileSize)} •{" "}
                            {formatRelativeTime(new Date(submission.createdAt))}
                          </p>
                        </div>
                      </div>
                      {submission.s3Url && (isAdmin || isFinished) ? (
                        <Button
                          onClick={() =>
                            handleDownload(submission.id, submission.fileName)
                          }
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500 px-3">
                          Processing...
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final Deliverables (from admin) */}
          {adminSubmissions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {isAdmin ? "Admin Uploaded Files" : "Final Deliverables"}
                </h2>
                <div className="space-y-3">
                  {adminSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {submission.fileName}
                          </p>
                          <p className="text-xs text-slate-600">
                            {formatFileSize(submission.fileSize)} •{" "}
                            {formatRelativeTime(new Date(submission.createdAt))}
                          </p>
                          {submission.description && (
                            <p className="text-xs text-slate-600 mt-1">
                              {submission.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {submission.s3Url && (isAdmin || isFinished) ? (
                        <Button
                          onClick={() =>
                            handleDownload(submission.id, submission.fileName)
                          }
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500 px-3">
                          {submission.s3Url
                            ? "Awaiting completion"
                            : "Uploading..."}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          {project.notes && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Notes
                </h2>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {project.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Card (only show if finished and not admin) */}
          {!isAdmin && isFinished && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Payment
                </h2>

                {project.cost ? (
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-slate-900">
                        ${project.cost}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Total project cost</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      Cost to be determined
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePay}
                  isLoading={isPaying}
                  disabled={isPaying}
                  size="lg"
                  className="w-full gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {isPaying ? "Processing..." : "Pay Now (Demo)"}
                </Button>

                <p className="text-xs text-slate-500 mt-3 text-center">
                  Payment processing not yet implemented
                </p>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Project Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Project ID</p>
                  <p className="text-sm font-mono text-slate-900">
                    {project.id}
                  </p>
                </div>
                {project.tonnage !== null && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1">
                      {project.tonnage === 0 ? "Bill of Materials" : "Tonnage"}
                    </p>
                    <p className="text-sm text-slate-900">
                      {project.tonnage === 0
                        ? "Requested"
                        : `${project.tonnage} tons`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-600 mb-1">Files Uploaded</p>
                  <p className="text-sm text-slate-900">
                    {project.submissions?.length || 0} file
                    {(project.submissions?.length || 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Video</p>
                  <p className="text-sm text-slate-900">
                    {project.videoUrl ? "Uploaded" : "Not uploaded"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin File Upload Modal */}
      {isAdmin && (
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadFile(e.target.files[0]);
                  }
                }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-slate-600">
                  {uploadFile.name} (
                  {(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
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
                onClick={handleFileUpload}
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
      )}

      {/* Admin Video Upload Modal */}
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
