"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
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
  LogOut,
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
      {/* ==================== TOP NAVBAR ==================== */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.svg" alt="StickModel" className="h-10 w-auto" />
            <span className="font-semibold text-slate-900">StickModel</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Admin Dashboard</span>
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

        {/* ==================== TABS & SEARCH ==================== */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeTab === "projects"
                  ? "bg-orange-100 text-orange-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                Projects
              </span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeTab === "users"
                  ? "bg-orange-100 text-orange-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </span>
            </button>
          </div>

          {/* Search & Refresh */}
          <div className="flex gap-3 items-center">
            <div className="relative group w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <Input
                type="text"
                placeholder={`Search ${activeTab === "projects" ? "projects" : "users"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
              />
            </div>
            <Button
              onClick={fetchData}
              variant="secondary"
              className="gap-2 px-3 py-2 h-auto border-slate-200 hover:bg-slate-100 text-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

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
                    className="p-6 hover:bg-slate-50 transition-colors group"
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
                        <Link href={`/requests/${project.id}`}>
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
                        </Link>
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
                  {searchQuery ? "No projects found" : "No projects yet"}
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
    </div>
  );
}
