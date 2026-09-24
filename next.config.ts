import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack (default in Next.js 16)
  turbopack: {},
  async redirects() {
    return [
      {
        source: "/about/wireframe-models",
        destination: "/wireframe-models",
        permanent: true,
      },
      {
        source: "/about/estimation-models",
        destination: "/estimation-models",
        permanent: true,
      },
      {
        source: "/about/3d-model-from-2d-drawing",
        destination: "/3d-model-from-2d-drawing",
        permanent: true,
      },
      {
        source: "/about/bim-integration",
        destination: "/bim-integration",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
