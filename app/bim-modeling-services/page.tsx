import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { serviceJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "BIM Modeling Services for Structural Steel — StickModel";
const DESCRIPTION =
  "StickModel's BIM modeling service converts your 2D structural drawings into an IFC-compatible 3D model within 24 hours — the geometric foundation for your BIM workflow.";
const PAGE_URL = `${SITE_URL}/bim-modeling-services`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What are BIM modeling services?",
    answer:
      "BIM modeling services create and manage the digital 3D representation of a building or structure used throughout design, estimation, and construction. For structural steel, this means an accurate model of every member, grid, and elevation that can be shared across engineering, estimating, and fabrication teams.",
  },
  {
    question: "What BIM deliverable does StickModel provide?",
    answer:
      "StickModel delivers a 3D wireframe model as an IFC file — the geometric foundation for a BIM workflow. It's not a fully detailed, LOD-400 fabrication model; it's the accurate structural geometry that lets your team begin BIM coordination, quantity extraction, or detailing without modeling the structure from scratch.",
  },
  {
    question: "How fast is BIM model delivery?",
    answer:
      "Always 24 hours, whether the project is 200 T or 2,000 T. Every model is checked against your original drawings before delivery to confirm dimensions, member lengths, and connectivity.",
  },
  {
    question: "Which BIM platforms are supported?",
    answer:
      "Our IFC exports are compatible with Tekla Structures, Tekla PowerFab, Revit, and all major BIM platforms. If you use a platform not listed here, contact us and we'll confirm compatibility before you commit to a project.",
  },
];

export default function BimModelingServicesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          BIM modeling services for structural steel
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          StickModel&apos;s BIM modeling service converts your 2D structural
          drawings into an accurate, IFC-compatible 3D model within 24 hours —
          the geometric foundation your team needs before full BIM
          coordination, quantity takeoff, or detailing can begin.
        </p>

        <WireframeArt variant="grid" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">
          What are BIM modeling services?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Building Information Modelling (BIM) is a process for creating and
          managing digital representations of a built asset across its
          lifecycle. A BIM modeling service produces that digital
          representation — for structural steel, this means every member
          positioned accurately in 3D space, ready to be shared, coordinated,
          and built on by engineers, estimators, and fabricators.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          What BIM deliverable does StickModel provide?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          We deliver a 3D wireframe model in IFC format — accurate structural
          geometry, correctly gridded and elevated, that serves as the
          starting point for a full BIM workflow. This is particularly useful
          in early-stage estimation or detailing, where a full LOD model isn&apos;t
          yet warranted but accurate quantities and geometry are already
          needed.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How fast is BIM model delivery?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Delivery is always 24 hours, regardless of project size. Every
          model goes through a geometric audit cross-referenced against your
          original documentation before it&apos;s sent to you.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Which BIM platforms are supported?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Our IFC exports are compatible with Tekla Structures, Tekla
          PowerFab, Revit, and all major BIM platforms — see our{" "}
          <Link href="/about/bim-integration" className="text-[#E67E00] hover:underline">
            BIM and ABM integration
          </Link>{" "}
          page for the full platform list.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Start your BIM model
          </Link>
        </div>
      </main>

      <FaqSection faqs={FAQS} heading="Frequently Asked Questions" />
      <FaqJsonLd faqs={FAQS} />
      <JsonLd
        data={serviceJsonLd({
          name: "BIM Modeling Services for Structural Steel",
          description: DESCRIPTION,
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
