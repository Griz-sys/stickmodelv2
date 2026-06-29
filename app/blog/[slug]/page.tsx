"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: string;
  status: string;
  createdAt: string;
  publishedAt: string | null;
  author: { id: string; name: string } | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const d = await r.json();
        setPost(d.post);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  async function handleDelete() {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(true);
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    router.push("/blog");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeroNav />
        <div className="flex justify-center py-40">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-[#E67E00] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <HeroNav />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-[#E67E00] hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        {/* Category + draft badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[#E67E00] font-bold text-xs tracking-[0.15em] uppercase">
            {post.category}
          </span>
          {post.status === "draft" && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
              Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold">
              {post.author ? initials(post.author.name) : "ST"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {post.author?.name ?? "StickModel Team"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDate(post.publishedAt ?? post.createdAt)}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                href={`/blog/${post.slug}/edit`}
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
          )}
        </div>

        {/* Cover image */}
        <div className="w-full aspect-[16/9] overflow-hidden rounded-sm mb-10 bg-stone-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body */}
        <div
          className="blog-body text-slate-700 text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        <style>{`
          .blog-body h2 { font-size: 1.5rem; font-weight: 900; color: #0f172a; margin: 2rem 0 0.75rem; }
          .blog-body h3 { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 1.5rem 0 0.5rem; }
          .blog-body p { margin-bottom: 1rem; }
          .blog-body strong { color: #0f172a; font-weight: 700; }
          .blog-body em { font-style: italic; }
          .blog-body ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .blog-body ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          .blog-body li { margin-bottom: 0.25rem; }
          .blog-body a { color: #E67E00; text-decoration: underline; }
        `}</style>
      </main>

      <SiteFooter />
    </div>
  );
}
