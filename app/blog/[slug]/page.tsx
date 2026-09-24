import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site-schema";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PostAdminControls } from "./post-admin-controls";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
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

async function getPost(slug: string) {
  const user = await getCurrentUser();
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { id: true, name: true } } },
  });

  if (!post) return null;
  if (post.status !== "published" && user?.role !== "admin") return null;

  return { post, isAdmin: user?.role === "admin" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPost(slug);
  if (!result) return {};

  const { post } = result;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: [{ url: post.coverImage }],
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPost(slug);

  if (!result) notFound();

  const { post, isAdmin } = result;
  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name ?? "StickModel Team",
    },
    publisher: {
      "@type": "Organization",
      name: "StickModel",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/horizontal.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <JsonLd data={jsonLd} />
      <HeroNav />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

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

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
          {post.title}
        </h1>

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

          {isAdmin && <PostAdminControls slug={post.slug} />}
        </div>

        <div className="w-full aspect-[16/9] overflow-hidden rounded-sm mb-10 bg-stone-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

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
