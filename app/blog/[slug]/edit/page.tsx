"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PostForm, PostFormValues } from "@/components/blog/PostForm";
import { ArrowLeft } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: string;
  status: string;
}

export default function EditBlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role !== "admin") router.replace("/blog");
      })
      .catch(() => router.replace("/blog"));
  }, [router]);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(async (r) => {
        if (!r.ok) {
          router.replace("/blog");
          return;
        }
        const d = await r.json();
        setPost(d.post);
        setLoading(false);
      })
      .catch(() => router.replace("/blog"));
  }, [slug, router]);

  async function submit(values: PostFormValues, status: "draft" | "published") {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
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

  if (loading || !post) {
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
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Post
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-1">
            Edit Post
          </h1>
          <p className="text-slate-500 text-sm">
            Update your engineering insights.
          </p>
        </div>

        <div className="border border-stone-200 rounded-sm p-6 md:p-8">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm rounded-sm">
              {error}
            </div>
          )}
          <PostForm
            initialValues={{
              title: post.title,
              excerpt: post.excerpt,
              coverImage: post.coverImage,
              category: post.category,
              bodyContent: post.body,
            }}
            onSaveDraft={(v) => submit(v, "draft")}
            onPublish={(v) => submit(v, "published")}
            saving={saving}
            currentStatus={post.status}
          />
        </div>
      </main>
    </div>
  );
}
