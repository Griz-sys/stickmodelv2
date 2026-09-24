import type { MetadataRoute } from "next";

const DISALLOWED_PATHS = [
  "/login",
  "/home",
  "/admin",
  "/admin/*",
  "/requests/*",
  "/blog/new",
  "/blog/*/edit",
];

// AI answer-engine / assistant crawlers we explicitly want indexing this site,
// in addition to the default "*" rule below.
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: "https://stickmodel.com/sitemap.xml",
  };
}
