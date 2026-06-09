import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "3D Model from 2D Drawing — StickModel Conversion Service",
  description:
    "Send us your 2D structural drawings and receive an accurate 3D stick or wireframe model within 24 hours. Supports DWG and PDF formats.",
  alternates: {
    canonical: "https://stickmodel.com/about/3d-model-from-2d-drawing",
  },
};

export default function ThreeDModelPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <Link
          href="/about"
          className="inline-block text-sm text-slate-500 hover:text-[#E67E00] transition-colors mb-10"
        >
          ← Back to About
        </Link>

        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          3D model from 2D structural drawing
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          StickModel specialises in converting 2D structural drawings into
          accurate 3D stick and wireframe models. Whether you have DWG files,
          PDFs, our team produces a clean 3D model from
          your 2D drawing within 24 hours. The resulting model can be used for
          estimation, material takeoff, BIM coordination, or structural review.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How the 2D to 3D conversion works
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          You upload your 2D structural drawings — plans, elevations, sections,
          or a combination — along with any relevant specifications. Our team
          reads the drawings, interprets the structural geometry, and builds a
          3D stick or wireframe model that matches your documentation exactly.
          You receive the completed model in your chosen format, ready to use.
          We handle all structural types: steel frames, trusses, portal frames,
          space frames, roof structures, and mixed-material systems.
        </p>

        <h2 className="text-3xl font-semibold mb-5">Supported file formats</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          We accept 2D drawings in any of the following formats:
        </p>
        <ul className="space-y-2 mb-6 ml-4">
          {[
            "DWG (AutoCAD)",
            "DXF",
            "PDF",
          ].map((fmt) => (
            <li key={fmt} className="flex items-start gap-3 text-slate-600">
              <span className="mt-2 w-2 h-2 rounded-full bg-[#E67E00] flex-shrink-0" />
              <span>{fmt}</span>
            </li>
          ))}
        </ul>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          3D model outputs are delivered in your preferred format including DWG
          3D, IFC, and our native format compatible with Tekla PowerFab and
          other estimation platforms.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Turnaround time and accuracy
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Standard turnaround is 24 hours from drawing submission. For large or
          complex structures, we confirm timing at the point of upload. Every
          model is checked against the source drawings before delivery —
          dimensions, member lengths, and connectivity are verified to ensure
          the model matches your documentation exactly.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Why convert 2D drawings to a 3D model?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Working from 2D drawings for estimation or fabrication is slow and
          introduces errors that are hard to catch before they become expensive
          on site. A 3D model gives every stakeholder — estimators, engineers,
          fabricators, and project managers — a single accurate source of
          geometry. Quantities are extracted from the model, not scaled from
          paper. Coordination happens in three dimensions, not two.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Send us your drawings
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
