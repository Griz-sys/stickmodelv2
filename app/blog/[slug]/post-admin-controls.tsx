"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export function PostAdminControls({ slug }: { slug: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(true);
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    router.push("/blog");
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/blog/${slug}/edit`}
        className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-600 px-3 py-1.5 text-xs font-semibold hover:border-slate-500 transition-colors"
      >
        <Pencil size={12} />
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 border border-rose-200 text-rose-600 px-3 py-1.5 text-xs font-semibold hover:border-rose-400 transition-colors disabled:opacity-50"
      >
        <Trash2 size={12} />
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
