"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, PenSquare, Pencil, Trash2 } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  status: string;
  createdAt: string;
  publishedAt: string | null;
  author: { id: string; name: string } | null;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogListClient({
  initialPosts,
  isAdmin,
}: {
  initialPosts: BlogPost[];
  isAdmin: boolean;
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [filter, setFilter] = useState<"all" | "published">("all");

  const visiblePosts = useMemo(
    () => (isAdmin && filter === "all" ? posts : posts.filter((p) => p.status === "published")),
    [posts, isAdmin, filter],
  );

  const featured = visiblePosts[0];
  const rest = visiblePosts.slice(1);

  async function deletePost(slug: string) {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }

  return (
    <>
      {/* Admin controls */}
      {isAdmin && (
        <div className="border-b border-stone-100 bg-[#fafaf8]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-4 flex justify-end gap-3">
            <div className="flex items-center bg-white border border-stone-200 rounded-full overflow-hidden text-sm font-semibold">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2 transition-colors ${
                  filter === "all" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`px-5 py-2 transition-colors ${
                  filter === "published" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Published
              </button>
            </div>
            <Link
              href="/blog/new"
              className="flex items-center gap-2 bg-[#E67E00] hover:bg-[#d66c00] text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors rounded-full"
            >
              <PenSquare size={14} />
              New Post
            </Link>
          </div>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-14">
        {visiblePosts.length === 0 ? (
          <div className="flex flex-col items-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-5">
              <PenSquare size={24} className="text-stone-400" />
            </div>
            <p className="text-xl font-bold text-slate-700 mb-2">No posts yet</p>
            <p className="text-slate-400 text-sm mb-6">
              Engineering insights will appear here once published.
            </p>
            {isAdmin && (
              <Link
                href="/blog/new"
                className="inline-flex items-center gap-2 bg-[#E67E00] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#d66c00] transition-colors rounded-full"
              >
                <PenSquare size={14} />
                Write the first post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured (first) post */}
            {featured && (
              <div className="group relative">
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <Link
                      href={`/blog/${featured.slug}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-white/90 hover:bg-white border border-stone-200 text-slate-700 px-3 py-1.5 text-xs font-semibold rounded-sm shadow-sm transition-colors"
                    >
                      <Pencil size={11} />
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(featured.slug);
                      }}
                      className="flex items-center gap-1.5 bg-white/90 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-rose-600 px-3 py-1.5 text-xs font-semibold rounded-sm shadow-sm transition-colors"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                )}
                <Link href={`/blog/${featured.slug}`} className="block">
                  <article className="grid md:grid-cols-2 gap-0 border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden bg-stone-100 aspect-[4/3] md:aspect-auto">
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      {featured.status === "draft" && (
                        <span className="absolute top-3 left-3 bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                          Draft
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex flex-col justify-between p-8 md:p-10 bg-white">
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <span className="text-[#E67E00] font-bold text-[11px] tracking-[0.2em] uppercase">
                            {featured.category}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-stone-400 text-[11px]">
                            {formatDate(featured.publishedAt ?? featured.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black leading-tight text-slate-900 mb-4 group-hover:text-[#E67E00] transition-colors duration-200">
                          {featured.title}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                          {featured.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold">
                            {featured.author ? initials(featured.author.name) : "ST"}
                          </div>
                          <span className="text-slate-600 text-xs font-medium">
                            {featured.author?.name ?? "StickModel Team"}
                          </span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[#E67E00] text-sm font-bold group-hover:gap-3 transition-all duration-200">
                          Read Article
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )}

            {/* Remaining posts grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    More Articles
                  </span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <div key={post.id} className="group relative flex flex-col">
                      {isAdmin && (
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            href={`/blog/${post.slug}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 bg-white/95 hover:bg-white border border-stone-200 text-slate-700 px-2.5 py-1 text-[10px] font-semibold rounded-sm shadow-sm transition-colors"
                          >
                            <Pencil size={9} />
                            Edit
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePost(post.slug);
                            }}
                            className="flex items-center gap-1 bg-white/95 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-rose-600 px-2.5 py-1 text-[10px] font-semibold rounded-sm shadow-sm transition-colors"
                          >
                            <Trash2 size={9} />
                            Delete
                          </button>
                        </div>
                      )}
                      <Link href={`/blog/${post.slug}`} className="block flex-1">
                        <article className="border border-stone-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                          <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                            />
                            {post.status === "draft" && (
                              <span className="absolute top-2 left-2 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
                                Draft
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col flex-1 p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[#E67E00] font-bold text-[10px] tracking-[0.15em] uppercase">
                                {post.category}
                              </span>
                              <span className="text-stone-300 text-[10px]">·</span>
                              <span className="text-stone-400 text-[10px]">
                                {formatDate(post.publishedAt ?? post.createdAt)}
                              </span>
                            </div>
                            <h3 className="font-black text-[15px] leading-snug text-slate-900 mb-2 group-hover:text-[#E67E00] transition-colors duration-200 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                                  {post.author ? initials(post.author.name) : "ST"}
                                </div>
                                <span className="text-stone-400 text-[11px]">
                                  {post.author?.name ?? "StickModel Team"}
                                </span>
                              </div>
                              <span className="flex items-center gap-1 text-[#E67E00] text-[11px] font-bold group-hover:gap-2 transition-all duration-200">
                                Read
                                <ArrowRight size={11} />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="text-center text-stone-400 text-xs pt-4">
              {visiblePosts.length} post{visiblePosts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </main>
    </>
  );
}
