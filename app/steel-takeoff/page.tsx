import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { serviceJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "Steel Takeoff Services — StickModel";
const DESCRIPTION =
  "Get an accurate steel takeoff from your 2D structural drawings in 24 hours. StickModel builds the 3D geometry your estimators quantify from, instead of scaling drawings by hand.";
const PAGE_URL = `${SITE_URL}/steel-takeoff`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What is a steel takeoff?",
    answer:
      "A steel takeoff is the process of quantifying every structural steel member in a project — beams, columns, braces — from drawings, so estimators can price materials and fabrication. It's the basis for a project's cost estimate and purchasing schedule.",
  },
  {
    question: "How does StickModel speed up steel takeoff?",
    answer:
      "Instead of scaling quantities off flat 2D drawings by hand, your estimator works from a 3D wireframe model where every member length, section, and connection point is already geometrically accurate. Quantities are extracted directly from the model, which is faster and catches omissions that manual scaling routinely misses.",
  },
  {
    question: "What do I receive for a steel takeoff project?",
    answer:
      "You receive the 3D wireframe model as an IFC file. If you need itemized quantities rather than just geometry, add the Advanced Bill of Materials (ABM) add-on for detailed material quantities and specifications.",
  },
  {
    question: "How long does a steel takeoff model take to deliver?",
    answer:
      "24 hours, regardless of project size. If your drawings have missing information needed for an accurate takeoff, we'll flag it and contact you before proceeding rather than guessing.",
  },
];

export default function SteelTakeoffPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          Steel takeoff from your 2D structural drawings
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          A steel takeoff is only as accurate as the geometry it&apos;s measured
          from. StickModel converts your 2D structural drawings into a
          precise 3D wireframe model within 24 hours, so your estimating team
          can extract quantities from accurate geometry instead of scaling
          flat drawings by hand.
        </p>

        <WireframeArt variant="truss" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">What is a steel takeoff?</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A steel takeoff is the process of quantifying every structural
          steel member in a project from the drawings — lengths, sections,
          and quantities of beams, columns, and braces. It&apos;s the foundation
          of a project&apos;s cost estimate, material ordering, and fabrication
          planning.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How StickModel speeds up steel takeoff
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Manual takeoff from 2D drawings is slow and error-prone — every
          member has to be measured and cross-checked by hand. When your
          estimator works from a StickModel wireframe instead, every member&apos;s
          length, section, and connection point is already geometrically
          accurate in 3D. Quantities are extracted directly from the model,
          not scaled from paper, which is both faster and catches omissions
          that flat drawings routinely miss.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          What you receive
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Every project includes an IFC file of your 3D model, containing the
          primary structural steel in the project. If you need itemized
          material quantities rather than just geometry, add the{" "}
          <Link href="/bill-of-materials-steel" className="text-[#E67E00] hover:underline">
            Advanced Bill of Materials (ABM)
          </Link>{" "}
          add-on to the same project.
        </p>

        <h2 className="text-3xl font-semibold mb-5">Turnaround time</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Always 24 hours, whether your project is 200 T or 2,000 T. If
          critical information is missing from your drawings, we&apos;ll flag it
          and contact you before proceeding rather than making assumptions
          that could affect quantities.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Get your steel takeoff
          </Link>
        </div>
      </main>

      <FaqSection faqs={FAQS} heading="Frequently Asked Questions" />
      <FaqJsonLd faqs={FAQS} />
      <JsonLd
        data={serviceJsonLd({
          name: "Steel Takeoff",
          description: DESCRIPTION,
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
