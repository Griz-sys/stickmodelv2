import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About StickModel — Structural Drawing to Stick Model Conversion",
  description:
    "Learn how StickModel converts 2D structural drawings into wireframe and estimation models for construction, BIM workflows, and Tekla PowerFab.",
  alternates: { canonical: "https://stickmodel.com/about" },
};

const services = [
  {
    title: "Wireframe models for construction",
    href: "/about/wireframe-models",
  },
  {
    title: "Structural estimation models",
    href: "/about/estimation-models",
  },
  {
    title: "3D model from 2D drawing",
    href: "/about/3d-model-from-2d-drawing",
  },
  {
    title: "BIM and Tekla PowerFab integration",
    href: "/about/bim-integration",
  },
];

const reasons = [
  "24-hour turnaround on most projects",
  "Works from any drawing format — DWG or PDF",
  "Compatible with BIM, ABM, and Tekla PowerFab workflows",
  "Used by structural engineers, estimators, and steel fabricators",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          About StickModel
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          StickModel is a specialist conversion service that transforms 2D
          structural drawings into accurate 3D stick and wireframe models. We
          work with structural engineers, estimators, steel fabricators, and
          construction managers who need reliable 3D geometry fast — without
          the time and cost of full BIM modelling.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Send us your drawings. We return a complete model within 24 hours.
        </p>

        <h2 className="text-3xl font-semibold mb-6">What we do</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          StickModel takes your 2D structural drawings — in any format — and
          produces a precise 3D line model ready for estimation, material
          takeoff, BIM coordination, or fabrication planning. Our models are
          compatible with Tekla PowerFab, Tekla Structures, Revit, and all
          major BIM platforms.
        </p>

        <h2 className="text-3xl font-semibold mb-8">Our services</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="block p-6 border-2 border-slate-200 rounded-xl hover:border-[#E67E00] hover:bg-[#E67E00]/5 transition-all group"
            >
              <span className="font-semibold text-slate-900 group-hover:text-[#E67E00] transition-colors">
                {service.title}
              </span>
              <span className="block text-sm text-slate-400 mt-1 group-hover:text-[#E67E00]/70 transition-colors">
                Learn more →
              </span>
            </Link>
          ))}
        </div>

        <h2 className="text-3xl font-semibold mb-6">Why StickModel</h2>
        <ul className="space-y-3 mb-16">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-[#E67E00] flex-shrink-0" />
              <span className="text-lg">{reason}</span>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
