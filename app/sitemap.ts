import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stickmodel.com";

  return [
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
      url: `${base}/about/wireframe-models`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/about/estimation-models`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/about/3d-model-from-2d-drawing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/about/bim-integration`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
