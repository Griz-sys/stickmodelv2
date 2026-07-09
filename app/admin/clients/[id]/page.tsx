"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FolderKanban,
  Loader2,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { InfoPair, EmptyState } from "@/components/admin/admin-ui";
import {
  ClientFormModal,
  type Client,
} from "@/components/admin/client-form-modal";

interface Project {
  id: string;
  name: string;
  tonnage: number | null;
  dateUpload: string;
  dateFinish: string | null;
  cost: number | null;
  status: string;
  notes: string | null;
  queueOrder: number | null;
}

export default function AdminClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clientId = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeletingProjectId, setIsDeletingProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [clientResponse, projectsResponse] = await Promise.all([
        fetch(`/api/admin/users/${clientId}`),
        fetch(`/api/projects?userId=${clientId}`),
      ]);

      if (!clientResponse.ok) {
        setNotFound(true);
        return;
      }

      const clientData = await clientResponse.json();
      const projectsData = await projectsResponse.json();
      setClient(clientData.user);
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error("Failed to fetch client data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Delete project "${project.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeletingProjectId(project.id);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to delete project");
        return;
      }

      setProjects((prev) => prev.filter((item) => item.id !== project.id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    } finally {
      setIsDeletingProjectId(null);
    }
  };

  const currentProjects = useMemo(
    () =>
      projects
        .filter((project) => project.status !== "finished")
        .sort((a, b) => {
          if (a.queueOrder != null && b.queueOrder != null)
            return a.queueOrder - b.queueOrder;
          if (a.queueOrder != null) return -1;
          if (b.queueOrder != null) return 1;
          return (
            new Date(a.dateUpload).getTime() - new Date(b.dateUpload).getTime()
          );
        }),
    [projects],
  );

  const doneProjects = useMemo(
    () =>
      projects
        .filter((project) => project.status === "finished")
        .sort((a, b) => {
          const aTime = new Date(a.dateFinish || a.dateUpload).getTime();
          const bTime = new Date(b.dateFinish || b.dateUpload).getTime();
          return bTime - aTime;
        }),
    [projects],
  );

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">
            Client not found
          </p>
          <Link
            href="/admin"
            className="mt-4 inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img src="/horizontal.svg" alt="StickModel" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Admin Dashboard
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        {isLoading || !client ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                  {client.name}
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500">
                  {client.companyName || client.email}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-3 max-w-2xl">
                  <InfoPair label="Email" value={client.email} />
                  <InfoPair
                    label="Company"
                    value={client.companyName || "Not provided"}
                  />
                  <InfoPair
                    label="Projects"
                    value={`${client._count.projects} total`}
                  />
                </div>
              </div>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => setShowEditModal(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit Client
              </Button>
            </div>

            <section className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Clock className="h-5 w-5 text-blue-600" />
                Current
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {currentProjects.length}
                </span>
              </h2>
              {currentProjects.length === 0 ? (
                <EmptyState
                  icon={<FolderKanban className="h-12 w-12 text-slate-300" />}
                  message="No current projects"
                />
              ) : (
                <div className="space-y-3">
                  {currentProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      sequence={index + 1}
                      onDelete={handleDeleteProject}
                      isDeleting={isDeletingProjectId === project.id}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Done
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {doneProjects.length}
                </span>
              </h2>
              {doneProjects.length === 0 ? (
                <EmptyState
                  icon={<FolderKanban className="h-12 w-12 text-slate-300" />}
                  message="No finished projects"
                />
              ) : (
                <div className="space-y-3">
                  {doneProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      sequence={index + 1}
                      onDelete={handleDeleteProject}
                      isDeleting={isDeletingProjectId === project.id}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <ClientFormModal
        isOpen={showEditModal}
        mode="edit"
        client={client}
        onClose={() => setShowEditModal(false)}
        onSaved={(updated) => {
          setClient(updated);
          setShowEditModal(false);
        }}
      />
    </div>
  );
}

function ProjectCard({
  project,
  sequence,
  onDelete,
  isDeleting,
}: {
  project: Project;
  sequence: number;
  onDelete: (project: Project) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {sequence}
            </span>
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {project.name}
            </h3>
            <StatusBadge status={project.status as never} />
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
            <InfoPair
              label="Cost"
              value={
                project.cost !== null
                  ? `$${project.cost.toLocaleString()}`
                  : "Not set"
              }
            />
            <InfoPair
              label="Uploaded"
              value={new Date(project.dateUpload).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
            {project.dateFinish && (
              <InfoPair
                label="Finished"
                value={new Date(project.dateFinish).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              />
            )}
          </div>
          {project.notes && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Additional Note
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                {project.notes}
              </p>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 lg:min-w-[140px] lg:items-stretch">
          <Link href={`/requests/${project.id}`}>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Open
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={() => onDelete(project)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
