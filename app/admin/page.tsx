"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  FolderKanban,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { StatCard, InfoPair, EmptyState } from "@/components/admin/admin-ui";
import {
  ClientFormModal,
  type Client,
} from "@/components/admin/client-form-modal";

type ViewMode = "clients" | "projects";

interface Project {
  id: string;
  name: string;
  tonnage: number | null;
  dateUpload: string;
  dateFinish: string | null;
  cost: number | null;
  status: string;
  notes: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    companyName: string | null;
  } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("clients");

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeletingClientId, setIsDeletingClientId] = useState<string | null>(
    null,
  );
  const [isDeletingProjectId, setIsDeletingProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projectsResponse, usersResponse] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/admin/users"),
      ]);
      const [projectsData, usersData] = await Promise.all([
        projectsResponse.json(),
        usersResponse.json(),
      ]);
      setProjects(projectsData.projects || []);
      setClients(
        (usersData.users || []).filter(
          (user: Client) => user.role !== "admin",
        ),
      );
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
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

  const closeModal = () => {
    setModalMode(null);
    setSelectedClient(null);
  };

  const handleClientSaved = (client: Client) => {
    setClients((prev) => {
      const exists = prev.some((item) => item.id === client.id);
      return exists
        ? prev.map((item) => (item.id === client.id ? client : item))
        : [client, ...prev];
    });
    closeModal();
  };

  const handleDeleteClient = async (client: Client) => {
    const confirmed = window.confirm(
      `Delete client "${client.name}"? This will also remove their projects.`,
    );
    if (!confirmed) return;

    setIsDeletingClientId(client.id);
    try {
      const response = await fetch(`/api/admin/users/${client.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to delete client");
        return;
      }

      setClients((prev) => prev.filter((item) => item.id !== client.id));
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Failed to delete client");
    } finally {
      setIsDeletingClientId(null);
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

  const clientRows = useMemo(() => {
    return clients
      .map((client) => {
        const clientProjects = projects.filter(
          (project) => project.user?.id === client.id,
        );
        const latestDate = clientProjects.reduce<number | null>(
          (max, project) => {
            const time = new Date(project.dateUpload).getTime();
            return max === null || time > max ? time : max;
          },
          null,
        );
        const activeCount = clientProjects.filter(
          (project) => project.status !== "finished",
        ).length;
        const finishedCount = clientProjects.length - activeCount;

        return {
          client,
          projectCount: clientProjects.length,
          activeCount,
          finishedCount,
          latestDate,
        };
      })
      .sort((a, b) => {
        if (a.latestDate !== null && b.latestDate !== null) {
          return b.latestDate - a.latestDate;
        }
        if (a.latestDate !== null) return -1;
        if (b.latestDate !== null) return 1;
        return (
          new Date(b.client.createdAt).getTime() -
          new Date(a.client.createdAt).getTime()
        );
      });
  }, [clients, projects]);

  const filteredClientRows = useMemo(
    () =>
      clientRows.filter(({ client }) => {
        const query = searchQuery.toLowerCase();
        return (
          client.name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          (client.companyName || "").toLowerCase().includes(query)
        );
      }),
    [clientRows, searchQuery],
  );

  const filteredProjects = useMemo(
    () =>
      projects
        .filter((project) => {
          const query = searchQuery.toLowerCase();
          return (
            project.name.toLowerCase().includes(query) ||
            (project.user?.name || "").toLowerCase().includes(query) ||
            (project.user?.email || "").toLowerCase().includes(query)
          );
        })
        .sort(
          (a, b) =>
            new Date(b.dateUpload).getTime() - new Date(a.dateUpload).getTime(),
        ),
    [projects, searchQuery],
  );

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(
      (project) => project.status === "uploaded" || project.status === "in_progress",
    ).length,
    finishedProjects: projects.filter((project) => project.status === "finished")
      .length,
    totalClients: clients.length,
  };

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
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500">
              Browse clients and drill into their projects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <FolderKanban className="h-4 w-4" />
              View Blog
            </Link>
            <Link
              href="/blog/new"
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Blog Post
            </Link>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Clients"
            value={stats.totalClients}
            icon={<Users className="h-6 w-6" />}
            color="purple"
          />
          <StatCard
            label="Total Projects"
            value={stats.totalProjects}
            icon={<FolderKanban className="h-6 w-6" />}
            color="orange"
          />
          <StatCard
            label="Active Projects"
            value={stats.activeProjects}
            icon={<RefreshCw className="h-6 w-6" />}
            color="blue"
          />
          <StatCard
            label="Finished Projects"
            value={stats.finishedProjects}
            icon={<CheckCircle className="h-6 w-6" />}
            color="green"
          />
        </div>

        <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1 w-fit">
          {(["clients", "projects"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                viewMode === mode
                  ? "bg-white text-orange-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {mode === "clients" ? (
                <Users className="h-4 w-4" />
              ) : (
                <FolderKanban className="h-4 w-4" />
              )}
              {mode === "clients" ? "Client View" : "Project View"}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            {viewMode === "clients" ? (
              <Users className="h-5 w-5" />
            ) : (
              <FolderKanban className="h-5 w-5" />
            )}
            {viewMode === "clients" ? "Clients" : "Projects"}
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder={
                  viewMode === "clients"
                    ? "Search clients..."
                    : "Search projects..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 pl-9"
              />
            </div>
            {viewMode === "clients" && (
              <Button
                onClick={() => setModalMode("create")}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Create Client
              </Button>
            )}
            <Button onClick={fetchData} variant="secondary" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : viewMode === "projects" ? (
          <div className="space-y-3">
            {filteredProjects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-12 w-12 text-slate-300" />}
                message={searchQuery ? "No projects found" : "No projects yet"}
              />
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                          {project.name}
                        </h3>
                        <StatusBadge status={project.status as never} />
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
                        <InfoPair
                          label="Company"
                          value={project.user?.companyName || "Not provided"}
                        />
                        <InfoPair
                          label="Client"
                          value={project.user?.name || "Unassigned"}
                        />
                        <InfoPair
                          label="Email"
                          value={project.user?.email || "No email"}
                        />
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
                          value={new Date(project.dateUpload).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        />
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
                      {project.user?.id && (
                        <Link href={`/admin/clients/${project.user.id}`}>
                          <Button
                            variant="secondary"
                            className="w-full gap-2"
                          >
                            <Users className="h-4 w-4" />
                            Client
                          </Button>
                        </Link>
                      )}
                      <Link href={`/requests/${project.id}`}>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Open
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteProject(project)}
                        disabled={isDeletingProjectId === project.id}
                      >
                        {isDeletingProjectId === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClientRows.length === 0 ? (
              <EmptyState
                icon={<Users className="h-12 w-12 text-slate-300" />}
                message={searchQuery ? "No clients found" : "No clients yet"}
              />
            ) : (
              filteredClientRows.map(
                ({ client, projectCount, activeCount, finishedCount, latestDate }) => (
                  <div
                    key={client.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-orange-200"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="min-w-0 flex-1"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <h3 className="truncate text-lg font-semibold text-slate-900">
                            {client.companyName || client.name}
                          </h3>
                          {client.companyName && (
                            <span className="truncate rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                              {client.name}
                            </span>
                          )}
                        </div>
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
                          <span>
                            {projectCount}{" "}
                            {projectCount === 1 ? "Project" : "Projects"} Total
                          </span>
                          {activeCount > 0 && (
                            <span className="text-blue-600">
                              {activeCount} Ongoing
                            </span>
                          )}
                          {finishedCount > 0 && (
                            <span className="text-emerald-600">
                              {finishedCount} Done
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <InfoPair label="Email" value={client.email} />
                          <InfoPair
                            label="Company"
                            value={client.companyName || "Not provided"}
                          />
                          <InfoPair
                            label="Last Activity"
                            value={
                              latestDate
                                ? new Date(latestDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "No projects yet"
                            }
                          />
                          <InfoPair
                            label="Joined"
                            value={new Date(client.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" },
                            )}
                          />
                        </div>
                      </Link>
                      <div className="flex shrink-0 flex-col gap-2 lg:min-w-[140px] lg:items-stretch">
                        <Link href={`/admin/clients/${client.id}`}>
                          <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700">
                            View Projects
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          className="w-full gap-2"
                          onClick={() => {
                            setSelectedClient(client);
                            setModalMode("edit");
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteClient(client)}
                          disabled={isDeletingClientId === client.id}
                        >
                          {isDeletingClientId === client.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        )}
      </div>

      <ClientFormModal
        isOpen={modalMode !== null}
        mode={modalMode || "create"}
        client={selectedClient}
        onClose={closeModal}
        onSaved={handleClientSaved}
      />
    </div>
  );
}
