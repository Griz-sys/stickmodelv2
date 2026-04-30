"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  designation: string | null;
  companyName: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  phone: string | null;
  location: string | null;
  billingAddress: string | null;
  billingContactName: string | null;
  billingContactPhone: string | null;
  referralSource: string | null;
  referralDetail: string | null;
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
  notes: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

type Tab = "projects" | "users";

type UserFormState = {
  name: string;
  email: string;
  password: string;
  designation: string;
  companyName: string;
  companyEmail: string;
  companyWebsite: string;
  phone: string;
  location: string;
  billingAddress: string;
  billingContactName: string;
  billingContactPhone: string;
  referralSource: string;
  referralDetail: string;
};

const emptyUserForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  designation: "",
  companyName: "",
  companyEmail: "",
  companyWebsite: "",
  phone: "",
  location: "",
  billingAddress: "",
  billingContactName: "",
  billingContactPhone: "",
  referralSource: "",
  referralDetail: "",
};

const userFormFields: Array<{
  key: keyof UserFormState;
  label: string;
  type?: string;
  placeholder: string;
}> = [
  { key: "name", label: "Full Name", placeholder: "John Doe" },
  {
    key: "designation",
    label: "Designation",
    placeholder: "Structural Engineer",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "user@example.com",
  },
  {
    key: "password",
    label: "Password",
    placeholder: "Min 6 characters",
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    key: "location",
    label: "Location",
    placeholder: "City, State, Country",
  },
  {
    key: "companyName",
    label: "Company Name",
    placeholder: "ACME Fabricators",
  },
  {
    key: "companyEmail",
    label: "Company Email",
    type: "email",
    placeholder: "info@company.com",
  },
  {
    key: "companyWebsite",
    label: "Company Website",
    type: "url",
    placeholder: "https://company.com",
  },
  {
    key: "billingAddress",
    label: "Billing Address",
    placeholder: "123 Main St, City, State, ZIP",
  },
  {
    key: "billingContactName",
    label: "Billing Contact Name",
    placeholder: "Jane Smith",
  },
  {
    key: "billingContactPhone",
    label: "Billing Contact Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    key: "referralSource",
    label: "Referral Source",
    placeholder: "LinkedIn",
  },
  {
    key: "referralDetail",
    label: "Referral Detail",
    placeholder: "Additional source details",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
  const [userFormError, setUserFormError] = useState("");
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isDeletingUserId, setIsDeletingUserId] = useState<string | null>(null);
  const [isDeletingProjectId, setIsDeletingProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void fetchData();
  }, [activeTab]);

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
      setUsers(usersData.users || []);
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

  const closeUserModal = () => {
    setShowCreateUserModal(false);
    setShowEditUserModal(false);
    setSelectedUser(null);
    setUserForm(emptyUserForm);
    setUserFormError("");
  };

  const openCreateUserModal = () => {
    setUserForm(emptyUserForm);
    setUserFormError("");
    setSelectedUser(null);
    setShowCreateUserModal(true);
  };

  const openEditUserModal = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
      designation: user.designation ?? "",
      companyName: user.companyName ?? "",
      companyEmail: user.companyEmail ?? "",
      companyWebsite: user.companyWebsite ?? "",
      phone: user.phone ?? "",
      location: user.location ?? "",
      billingAddress: user.billingAddress ?? "",
      billingContactName: user.billingContactName ?? "",
      billingContactPhone: user.billingContactPhone ?? "",
      referralSource: user.referralSource ?? "",
      referralDetail: user.referralDetail ?? "",
    });
    setUserFormError("");
    setShowEditUserModal(true);
  };

  const handleSaveUser = async () => {
    setUserFormError("");

    if (!userForm.name.trim() || !userForm.email.trim()) {
      setUserFormError("Name and email are required");
      return;
    }

    if (showCreateUserModal && !userForm.password.trim()) {
      setUserFormError("Password is required");
      return;
    }

    if (userForm.password.trim() && userForm.password.length < 6) {
      setUserFormError("Password must be at least 6 characters");
      return;
    }

    setIsSavingUser(true);
    try {
      const isEditing = showEditUserModal && selectedUser;
      const endpoint = isEditing
        ? `/api/admin/users/${selectedUser.id}`
        : "/api/admin/users";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();
      if (!response.ok) {
        setUserFormError(data.error || "Failed to save user");
        return;
      }

      if (isEditing) {
        setUsers((prev) =>
          prev.map((user) => (user.id === data.user.id ? data.user : user)),
        );
      } else {
        setUsers((prev) => [data.user, ...prev]);
      }

      closeUserModal();
    } catch (error) {
      console.error("Failed to save user:", error);
      setUserFormError("Failed to save user");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = window.confirm(
      `Delete user "${user.name}"? This will also remove their projects.`,
    );
    if (!confirmed) return;

    setIsDeletingUserId(user.id);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      if (selectedUser?.id === user.id) {
        closeUserModal();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setIsDeletingUserId(null);
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

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.user?.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (project.user?.email || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [projects, searchQuery],
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [users, searchQuery],
  );

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(
      (project) => project.status === "uploaded" || project.status === "in_progress",
    ).length,
    finishedProjects: projects.filter((project) => project.status === "finished")
      .length,
    totalUsers: users.length,
  };

  const userModalOpen = showCreateUserModal || showEditUserModal;

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
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500">
              Manage users and projects with full edit and delete access.
            </p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6" />}
            color="purple"
          />
        </div>

        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            {(["projects", "users"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-orange-100 text-orange-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab === "projects" ? (
                    <FolderKanban className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  {tab === "projects" ? "Projects" : "Users"}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 pl-9"
              />
            </div>
            {activeTab === "users" && (
              <Button
                onClick={openCreateUserModal}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Create User
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
        ) : activeTab === "projects" ? (
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
                      <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
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
                      <Link href={`/requests/${project.id}`}>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Open
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        className="w-full gap-2"
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
            {filteredUsers.length === 0 ? (
              <EmptyState
                icon={<Users className="h-12 w-12 text-slate-300" />}
                message={searchQuery ? "No users found" : "No users yet"}
              />
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.name}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoPair label="Email" value={user.email} />
                        <InfoPair
                          label="Company"
                          value={user.companyName || "Not provided"}
                        />
                        <InfoPair
                          label="Projects"
                          value={`${user._count.projects} ${
                            user._count.projects === 1 ? "project" : "projects"
                          }`}
                        />
                        <InfoPair
                          label="Joined"
                          value={new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 lg:min-w-[140px] lg:items-stretch">
                      <Button
                        variant="secondary"
                        className="w-full gap-2"
                        onClick={() => openEditUserModal(user)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteUser(user)}
                        disabled={isDeletingUserId === user.id}
                      >
                        {isDeletingUserId === user.id ? (
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
        )}
      </div>

      <Modal
        isOpen={userModalOpen}
        onClose={closeUserModal}
        title={showEditUserModal ? "Edit User" : "Create User"}
        className="max-w-4xl"
      >
        <div className="space-y-6">
          {userFormError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {userFormError}
            </div>
          )}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              Password visibility is enabled here by design, so you can see the
              exact password you are assigning.
            </p>
            {showEditUserModal && (
              <p className="mt-1 text-xs text-amber-800">
                Leave the password field blank to keep the current password.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {userFormFields.map((field) => (
              <Input
                key={field.key}
                type={field.type || "text"}
                label={field.label}
                placeholder={field.placeholder}
                value={userForm[field.key]}
                onChange={(e) =>
                  setUserForm((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
              />
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button variant="secondary" onClick={closeUserModal}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={isSavingUser}>
              {isSavingUser ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : showEditUserModal ? (
                <Pencil className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {showEditUserModal ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "blue" | "green" | "purple";
}) {
  const styles = {
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${styles[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="break-words font-medium text-slate-900">{value}</p>
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
      {icon}
      <p className="mt-3 font-medium text-slate-600">{message}</p>
    </div>
  );
}
