"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Dropzone } from "@/components/upload/dropzone";
import { formatRelativeTime, formatFileSize, cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  FileStack,
  History,
  RefreshCw,
  Sparkles,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { upload } from "@vercel/blob/client";

const ITEMS_PER_PAGE = 10;

type Tab = "active" | "past";
type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "status";
type RequestStatus = "uploaded" | "in_progress" | "finished";

interface Project {
  id: string;
  name: string;
  tonnage: number | null;
  dateUpload: string;
  dateFinish: string | null;
  cost: number | null;
  status: RequestStatus;
  notes: string | null;
  userId: string;
  videoUrl: string | null;
  _count?: {
    submissions: number;
  };
}

interface UploadedFile {
  file: File;
  preview?: string;
}

const STATUS_FILTERS: { value: RequestStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "uploaded", label: "Uploaded" },
  { value: "in_progress", label: "In Progress" },
  { value: "finished", label: "Finished" },
];

export default function HomePage() {
  const router = useRouter();

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [includeBOM, setIncludeBOM] = useState(false);
  const [notes, setNotes] = useState("");
  const [confirmFiles, setConfirmFiles] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("active");

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // View All Modal state
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [viewAllTab, setViewAllTab] = useState<Tab>("active");
  const [viewAllSearch, setViewAllSearch] = useState("");
  const [viewAllSort, setViewAllSort] = useState<SortOption>("date-desc");
  const [viewAllShowSortMenu, setViewAllShowSortMenu] = useState(false);
  const [viewAllStatusFilter, setViewAllStatusFilter] = useState<
    RequestStatus | "all"
  >("all");
  const [viewAllPage, setViewAllPage] = useState(1);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeRequests = projects.filter(
    (r) => r.status !== "finished" || !r.dateFinish,
  );
  const pastRequests = projects.filter(
    (r) => r.status === "finished" && r.dateFinish,
  );
  const isNewUser = projects.length === 0;

  // Filter and sort requests for main view
  const filteredAndSortedRequests = useMemo(() => {
    const requests = activeTab === "active" ? activeRequests : pastRequests;

    let filtered = requests;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = requests.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query),
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.dateUpload).getTime() - new Date(a.dateUpload).getTime()
          );
        case "date-asc":
          return (
            new Date(a.dateUpload).getTime() - new Date(b.dateUpload).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "status":
          const statusOrder = { uploaded: 0, in_progress: 1, finished: 2 };
          return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeTab, activeRequests, pastRequests, searchQuery, sortBy]);

  // Filter and sort requests for View All modal
  const viewAllFilteredRequests = useMemo(() => {
    const requests = viewAllTab === "active" ? activeRequests : pastRequests;

    let filtered = requests;

    // Status filter
    if (viewAllStatusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === viewAllStatusFilter);
    }

    // Search filter
    if (viewAllSearch.trim()) {
      const query = viewAllSearch.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query),
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (viewAllSort) {
        case "date-desc":
          return (
            new Date(b.dateUpload).getTime() - new Date(a.dateUpload).getTime()
          );
        case "date-asc":
          return (
            new Date(a.dateUpload).getTime() - new Date(b.dateUpload).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "status":
          const statusOrder = { uploaded: 0, in_progress: 1, finished: 2 };
          return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    viewAllTab,
    activeRequests,
    pastRequests,
    viewAllSearch,
    viewAllSort,
    viewAllStatusFilter,
  ]);

  // Pagination for View All modal
  const totalPages = Math.ceil(viewAllFilteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = viewAllFilteredRequests.slice(
    (viewAllPage - 1) * ITEMS_PER_PAGE,
    viewAllPage * ITEMS_PER_PAGE,
  );

  const canSubmit =
    confirmFiles && confirmTerms && projectName.trim() && uploadedFile;

  const handleFileAdded = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile({ file });
      setShowModal(true);
    }
  }, []);

  const handleReplaceFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.dwg,.dxf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploadedFile({ file });
      }
    };
    input.click();
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setUploadedFile(null);
    setProjectName("");
    setIncludeBOM(false);
    setNotes("");
    setConfirmFiles(false);
    setConfirmTerms(false);
  }, []);

  const handleSubmit = async () => {
    if (!uploadedFile || !canSubmit) return;

    setIsSubmitting(true);

    try {
      // Step 1: Create project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          notes: notes.trim() || null,
          tonnage: includeBOM ? 0 : null, // Using tonnage to indicate BOM request
        }),
      });

      if (projectResponse.status === 401) {
        // Not authenticated - send user to home/login
        router.push("/");
        return;
      }

      if (!projectResponse.ok) {
        const errorText = await projectResponse.text();
        console.error("Create project failed:", errorText);
        throw new Error("Failed to create project");
      }

      const { project } = await projectResponse.json();

      // Step 2: Upload file directly to Vercel Blob using project-based pathname
      const blob = await upload(uploadedFile.file.name, uploadedFile.file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({
          projectId: project.id,
          isAdminResponse: false,
          fileName: uploadedFile.file.name,
        }),
      });

      // Step 3: Patch the project with single user-file metadata
      const updateResponse = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userFileName: uploadedFile.file.name,
          userFileUrl: blob.url,
          userFileSize: uploadedFile.file.size,
          userFileType: uploadedFile.file.type || "application/pdf",
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData.error || "Failed to update project with file URL",
        );
      }

      // Success!
      await fetchProjects();
      handleCloseModal();
      router.push(`/requests/${project.id}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenViewAll = (tab: Tab) => {
    setViewAllTab(tab);
    setViewAllPage(1);
    setViewAllSearch("");
    setViewAllStatusFilter("all");
    setShowViewAllModal(true);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "date-desc", label: "Newest first" },
    { value: "date-asc", label: "Oldest first" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "status", label: "Status" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column - Requests List */}
        <Card className="animate-fade-in flex flex-col">
          {/* Tabs with View All */}
          <div className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("active")}
                  className={cn(
                    "tab-button flex items-center gap-2",
                    activeTab === "active" && "active",
                  )}
                >
                  <FileStack className="w-4 h-4" />
                  Active
                  <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                    {activeRequests.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={cn(
                    "tab-button flex items-center gap-2",
                    activeTab === "past" && "active",
                  )}
                >
                  <History className="w-4 h-4" />
                  Past
                  <span className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                    {pastRequests.length}
                  </span>
                </button>
              </div>
              {(activeRequests.length > 0 || pastRequests.length > 0) && (
                <button
                  onClick={() => handleOpenViewAll(activeTab)}
                  className="mr-3 text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  View all
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Search and Sort */}
          {(activeRequests.length > 0 || pastRequests.length > 0) && (
            <div className="p-3 border-b border-slate-100 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-charcoal placeholder:text-slate-400"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Sort</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showSortMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSortMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors",
                            sortBy === option.value
                              ? "text-amber-600 bg-amber-50"
                              : "text-slate-700",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Request List */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {filteredAndSortedRequests.length === 0 ? (
              searchQuery ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No projects match &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <EmptyState
                  isNewUser={isNewUser && activeTab === "active"}
                  type={activeTab}
                />
              )
            ) : (
              filteredAndSortedRequests
                .slice(0, 5)
                .map((project, index) => (
                  <RequestItem
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))
            )}
          </div>

          {/* Show more indicator */}
          {filteredAndSortedRequests.length > 5 && (
            <div className="p-3 border-t border-slate-100 text-center">
              <button
                onClick={() => handleOpenViewAll(activeTab)}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                +{filteredAndSortedRequests.length - 5} more projects
              </button>
            </div>
          )}
        </Card>

        {/* Right Column - Upload Section */}
        <Card
          className="animate-fade-in flex flex-col"
          style={{ animationDelay: "100ms" }}
        >
          <CardContent className="p-6 flex flex-col flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-charcoal mb-1">
                Need a new Stickmodel?
              </h2>
              <p className="text-slate-500">Upload your structural drawing</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <Dropzone onFilesAdded={handleFileAdded} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View All Modal */}
      <Modal
        isOpen={showViewAllModal}
        onClose={() => setShowViewAllModal(false)}
        title={
          viewAllTab === "active" ? "All Active Projects" : "All Past Projects"
        }
        className="max-w-2xl"
      >
        <div className="p-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setViewAllTab("active");
                setViewAllPage(1);
                setViewAllStatusFilter("all");
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                viewAllTab === "active"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              Active ({activeRequests.length})
            </button>
            <button
              onClick={() => {
                setViewAllTab("past");
                setViewAllPage(1);
                setViewAllStatusFilter("all");
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                viewAllTab === "past"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              Past ({pastRequests.length})
            </button>
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setViewAllStatusFilter(filter.value);
                  setViewAllPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                  viewAllStatusFilter === filter.value
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={viewAllSearch}
                onChange={(e) => {
                  setViewAllSearch(e.target.value);
                  setViewAllPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-charcoal placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setViewAllShowSortMenu(!viewAllShowSortMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-slate-500" />
                Sort
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {viewAllShowSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setViewAllShowSortMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setViewAllSort(option.value);
                          setViewAllShowSortMenu(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors",
                          viewAllSort === option.value
                            ? "text-amber-600 bg-amber-50"
                            : "text-slate-700",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-500 mb-3">
            Showing {paginatedRequests.length} of{" "}
            {viewAllFilteredRequests.length} projects
          </p>

          {/* Project List */}
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {paginatedRequests.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No projects found</p>
              </div>
            ) : (
              paginatedRequests.map((project) => (
                <Link
                  key={project.id}
                  href={`/requests/${project.id}`}
                  onClick={() => setShowViewAllModal(false)}
                  className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-charcoal truncate group-hover:text-amber-600 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>
                        {formatRelativeTime(new Date(project.dateUpload))}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setViewAllPage((p) => Math.max(1, p - 1))}
                disabled={viewAllPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {viewAllPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setViewAllPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={viewAllPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Project Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Create New Project"
        className="max-w-md"
      >
        <div className="p-6 space-y-5">
          {uploadedFile && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
                <button
                  onClick={handleReplaceFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-charcoal hover:bg-slate-100 rounded-md transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace
                </button>
              </div>
            </div>
          )}

          <div>
            <Input
              label="Project Name"
              placeholder="e.g., Tower Block A - Phase 1"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <Checkbox
              checked={includeBOM}
              onChange={(e) => setIncludeBOM(e.target.checked)}
              label="Include Bill of Materials"
              description="Request a detailed materials list with your project"
            />
          </div>

          <Textarea
            label="Additional Notes (optional)"
            placeholder="Any specific requirements or details about this project..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

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
                  className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  terms of use
                </a>
                .
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!canSubmit}
            >
              {isSubmitting ? "Creating Project..." : "Create Project"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function EmptyState({
  isNewUser,
  type,
}: {
  isNewUser: boolean;
  type: "active" | "past";
}) {
  if (isNewUser) {
    return (
      <div className="p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="font-medium text-charcoal mb-1">
          Welcome to StickModel
        </h3>
        <p className="text-sm text-slate-500 max-w-[200px]">
          Upload a file to create your first project
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center h-full flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
        {type === "active" ? (
          <FileStack className="w-6 h-6 text-slate-400" />
        ) : (
          <History className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <p className="text-sm text-slate-500">
        {type === "active" ? "No active projects" : "No completed projects"}
      </p>
    </div>
  );
}

function RequestItem({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/requests/${project.id}`}
      className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-medium text-charcoal truncate group-hover:text-amber-600 transition-colors">
            {project.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{formatRelativeTime(new Date(project.dateUpload))}</span>
          {project._count && project._count.submissions > 0 && (
            <>
              <span>•</span>
              <span>
                {project._count.submissions} file
                {project._count.submissions !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={project.status} />
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
      </div>
    </Link>
  );
}
