import type { Metadata } from "next";
import LandingPage from "./landing-client";

export const metadata: Metadata = {
  title: "StickModel — Wireframe & Estimation Models from 2D Structural Drawings",
  description:
    "Convert your 2D structural drawings into accurate wireframe and stick models for construction estimation. Fast, affordable, and BIM-compatible.",
  alternates: { canonical: "https://stickmodel.com/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StickModel",
  url: "https://stickmodel.com",
  description:
    "StickModel converts 2D structural drawings into wireframe and stick models for construction estimation, BIM workflows, and Tekla PowerFab.",
  serviceType: "Structural modelling and estimation",
  areaServed: "Worldwide",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
