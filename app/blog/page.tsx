import type { Metadata } from "next";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { BlogListClient } from "./blog-list-client";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TITLE = "Engineering Blog — StickModel Insights";
const DESCRIPTION =
  "Structural perspectives from the StickModel team — BIM, detailing, and delivery insights for engineers, estimators, and fabricators.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://stickmodel.com/blog" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "https://stickmodel.com/blog", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function BlogPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  const posts = await prisma.blogPost.findMany({
    where: isAdmin ? undefined : { status: "published" },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      {/* Hero header */}
      <div className="border-b border-stone-100 bg-[#fafaf8]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="block w-0.5 h-4 bg-[#E67E00]" />
            <span className="text-[#E67E00] font-bold text-[11px] tracking-[0.25em] uppercase">
              The Insights
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight text-slate-900">
            Engineering <span className="text-stone-300">Blog</span>
          </h1>
          <p className="mt-2 text-slate-500 text-sm max-w-sm">
            Structural perspectives from the StickModel team — BIM, detailing,
            and delivery.
          </p>
        </div>
      </div>

      <BlogListClient initialPosts={serializedPosts} isAdmin={isAdmin} />

      {/* CTA banner */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[#E67E00] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
              Ready to Contribute?
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none">
              <span className="text-white">Share Your</span>
              <br />
              <span className="text-slate-200">Expertise</span>
            </h2>
            <p className="text-slate-300 text-sm mt-4 max-w-sm leading-relaxed">
              Admin access required to publish posts. Contact the StickModel
              team.
            </p>
          </div>
          <Link
            href="/contact"
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 bg-[#E67E00] hover:bg-[#d66c00] text-white px-8 py-4 font-bold text-sm uppercase tracking-widest transition-colors"
          >
            Contact Us
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
