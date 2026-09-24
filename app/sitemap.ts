import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://stickmodel.com";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/faq`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/terms`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/about`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/wireframe-models`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/estimation-models`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/3d-model-from-2d-drawing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/bim-integration`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/structural-steel-detailing`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/bim-modeling-services`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/steel-takeoff`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/material-takeoff`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/bill-of-materials-steel`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/wireframe`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/stick-model`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
    postEntries = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to load blog posts for sitemap:", error);
  }

  return [...staticEntries, ...postEntries];
}
