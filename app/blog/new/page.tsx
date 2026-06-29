"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostForm, PostFormValues } from "@/components/blog/PostForm";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role !== "admin") {
          router.replace("/blog");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => router.replace("/blog"));
  }, [router]);

  async function submit(values: PostFormValues, status: "draft" | "published") {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save post.");
        setSaving(false);
        return;
      }
      router.push(`/blog/${data.post.slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center py-40">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-[#E67E00] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-1">
            New Post
          </h1>
          <p className="text-slate-500 text-sm">
            Share structural insights with the StickModel community.
          </p>
        </div>

        <div className="border border-stone-200 rounded-sm p-6 md:p-8">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm rounded-sm">
              {error}
            </div>
          )}
          <PostForm
            onSaveDraft={(v) => submit(v, "draft")}
            onPublish={(v) => submit(v, "published")}
            saving={saving}
          />
        </div>
      </main>
    </div>
  );
}
