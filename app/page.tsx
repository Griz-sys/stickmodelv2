import type { Metadata } from "next";
import LandingPage from "./landing-client";

const TITLE = "StickModel — Wireframe & Estimation Models from 2D Structural Drawings";
const DESCRIPTION =
  "Convert your 2D structural drawings into accurate wireframe and stick models for construction estimation. Fast, affordable, and BIM-compatible.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://stickmodel.com/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://stickmodel.com/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <LandingPage />;
}
