"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
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

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else if (response.status === 404) {
        router.push("/home");
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
    // Simulate payment (not implemented)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Payment functionality not yet implemented");
    setIsPaying(false);
  };

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
          <Link href="/home">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFinished = project.status === "finished";
  const isInProgress = project.status === "in_progress";
  const isUploaded = project.status === "uploaded";

  // Separate submissions by uploader role
  const userSubmissions = project.submissions.filter(
    (s) => s.uploadedBy === "user",
  );
  const adminSubmissions = project.submissions.filter(
    (s) => s.uploadedBy === "admin",
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
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
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Info */}
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
                      Your project is currently being processed. Check back soon
                      for updates.
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

          {/* Video Section (if available) */}
          {project.videoUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Video
                </h2>
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-amber-600" />
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      View Project Video
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Uploaded Files (by user) */}
          {userSubmissions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Your Uploaded Files
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
                      {submission.s3Url && (
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
                  Final Deliverables
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
                      {submission.s3Url && (
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
          {/* Payment Card (only show if finished) */}
          {isFinished && (
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
                    {project.submissions.length} file
                    {project.submissions.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
