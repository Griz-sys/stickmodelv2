import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Wireframe Models for Construction — StickModel",
  description:
    "Professional wireframe models built from your structural drawings. Used for construction planning, material takeoff, and project visualisation.",
  alternates: { canonical: "https://stickmodel.com/about/wireframe-models" },
};

export default function WireframeModelsPage() {
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
          Wireframe models for construction
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          A wireframe model is a three-dimensional line representation of a
          structure built directly from your 2D structural drawings. At
          StickModel, we produce precise wireframe models used by engineers,
          estimators, and contractors for construction planning, material
          takeoff, and project coordination. Every wireframe is built to match
          your drawings exactly — no guesswork, no approximation.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          What is a construction wireframe model?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A construction wireframe model shows the skeleton of a structure —
          beams, columns, connections, and geometry — as 3D lines without
          surface fills or materials. Unlike a full BIM model, a wireframe is
          lightweight, fast to produce, and purpose-built for estimation. It
          gives your team a clear spatial understanding of the structure so you
          can quantify materials, check geometry, and identify issues before
          work begins on site.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How wireframe models improve material takeoff
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Material takeoff from 2D drawings is slow and error-prone. When you
          work from a wireframe model, every member length, connection point,
          and section is visible in 3D. Estimators can extract quantities
          directly from the model rather than scaling off drawings manually.
          This reduces takeoff time significantly and catches omissions that
          flat drawings routinely miss. Our wireframe for material takeoff
          process is used by steel fabricators, structural engineers, and
          construction managers across the industry.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          From 2D drawing to wireframe in 24 hours
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Send us your structural drawings in DWG or PDF format and we return a complete wireframe model within 24 hours. We work
          across all structural types including steel frames, trusses, portal
          frames, and mixed structures. The output is a clean line model ready
          for review, estimation, or import into your existing workflow.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Who uses StickModel wireframe services?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Our wireframe models are used by estimators building material
          schedules, detailers building connection models, steel fabricators
          preparing shop drawings, and structural engineers validating design
          geometry. If your work involves turning 2D
          structural information into something you can measure, quantify, and
          communicate — a wireframe model is the fastest route there.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Start your wireframe project
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
