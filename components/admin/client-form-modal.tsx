"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export interface Client {
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

type ClientFormState = {
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

const emptyClientForm: ClientFormState = {
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

const clientFormFields: Array<{
  key: keyof ClientFormState;
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

export function ClientFormModal({
  isOpen,
  mode,
  client,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  mode: "create" | "edit";
  client: Client | null;
  onClose: () => void;
  onSaved: (client: Client) => void;
}) {
  const [form, setForm] = useState<ClientFormState>(emptyClientForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (mode === "edit" && client) {
      setForm({
        name: client.name ?? "",
        email: client.email ?? "",
        password: "",
        designation: client.designation ?? "",
        companyName: client.companyName ?? "",
        companyEmail: client.companyEmail ?? "",
        companyWebsite: client.companyWebsite ?? "",
        phone: client.phone ?? "",
        location: client.location ?? "",
        billingAddress: client.billingAddress ?? "",
        billingContactName: client.billingContactName ?? "",
        billingContactPhone: client.billingContactPhone ?? "",
        referralSource: client.referralSource ?? "",
        referralDetail: client.referralDetail ?? "",
      });
    } else {
      setForm(emptyClientForm);
    }
  }, [isOpen, mode, client]);

  const handleSave = async () => {
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }

    if (mode === "create" && !form.password.trim()) {
      setError("Password is required");
      return;
    }

    if (form.password.trim() && form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSaving(true);
    try {
      const endpoint =
        mode === "edit" && client
          ? `/api/admin/users/${client.id}`
          : "/api/admin/users";
      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to save client");
        return;
      }

      onSaved(data.user);
    } catch (err) {
      console.error("Failed to save client:", err);
      setError("Failed to save client");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Edit Client" : "Create Client"}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            Password visibility is enabled here by design, so you can see the
            exact password you are assigning.
          </p>
          {mode === "edit" && (
            <p className="mt-1 text-xs text-amber-800">
              Leave the password field blank to keep the current password.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {clientFormFields.map((field) => (
            <Input
              key={field.key}
              type={field.type || "text"}
              label={field.label}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <Button variant="secondary" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : mode === "edit" ? (
              <Pencil className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {mode === "edit" ? "Save Changes" : "Create Client"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
