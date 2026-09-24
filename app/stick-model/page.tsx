import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { definedTermJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "What Is a Stick Model? — StickModel";
const DESCRIPTION =
  "A stick model represents each structural member as a single line along its centroidal axis. Learn what it is, how it relates to a wireframe, and how StickModel delivers one.";
const PAGE_URL = `${SITE_URL}/stick-model`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What is a stick model?",
    answer:
      "A stick model (also called an analytical or line model) is a 3D skeletal representation of a structure, where every member — beam, column, brace — is represented as a single line along its centroidal axis, with correct grid and elevation placement.",
  },
  {
    question: "Is a stick model the same as a wireframe model?",
    answer:
      "In structural engineering, the terms are commonly used interchangeably — both describe a lightweight, line-based 3D representation of a structure without surfaces or fabrication-level detail. \"Stick model\" is used more often for the analytical/structural-analysis context, and \"wireframe\" more often in a construction or detailing context.",
  },
  {
    question: "Why are stick models used in structural engineering?",
    answer:
      "A stick model gives engineers and estimators accurate 3D geometry — member lengths, positions, and connectivity — without the overhead of a fully detailed model. It's fast to produce and is commonly used as the geometric basis for structural analysis, estimation, and detailing.",
  },
  {
    question: "How does StickModel deliver a stick model?",
    answer:
      "We convert your 2D structural drawings (DWG or PDF) into a fully constructible 3D stick model, delivered as an IFC file within 24 hours, ready to import into your detailing or BIM software.",
  },
];

export default function StickModelGlossaryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          What is a stick model?
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          A stick model — also called an analytical or line model — is a 3D
          skeletal representation of a structure, where every member is drawn
          as a single line along its centroidal axis, correctly positioned on
          its grid and elevation. It&apos;s the term structural engineers use for
          the same lightweight, line-based geometry that&apos;s called a
          &quot;wireframe&quot; in a construction or detailing context.
        </p>

        <WireframeArt variant="stick" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">
          Stick model vs. wireframe model
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          The two terms describe essentially the same thing: a 3D
          representation of a structure using lines instead of surfaces or
          fabrication-level detail. &quot;Stick model&quot; tends to be used in a
          structural-analysis context — each stick represents a member&apos;s
          centroidal axis for load-path and analysis purposes — while
          &quot;wireframe&quot; is more common in construction and detailing
          conversations. See our{" "}
          <Link href="/wireframe" className="text-[#E67E00] hover:underline">
            wireframe model
          </Link>{" "}
          page for that angle.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Why stick models are used in structural engineering
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A stick model gives engineers, estimators, and detailers accurate
          3D geometry — member lengths, positions, and connectivity — without
          the time and cost of building a fully detailed model. It&apos;s fast to
          produce and serves as the geometric basis for structural analysis,
          material estimation, and downstream detailing work.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How StickModel delivers a stick model
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Send us your 2D structural drawings in DWG or PDF format, and we
          return a fully constructible 3D stick model as an IFC file within
          24 hours — ready to import into Tekla Structures, Tekla PowerFab,
          or any major BIM platform.
        </p>

        <div className="border-t border-slate-200 pt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Get your stick model
          </Link>
          <Link
            href="/pricing"
            className="inline-block border-2 border-[#E67E00] text-[#E67E00] px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#E67E00] hover:text-white transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </main>

      <FaqSection faqs={FAQS} heading="Frequently Asked Questions" />
      <FaqJsonLd faqs={FAQS} />
      <JsonLd
        data={definedTermJsonLd({
          name: "Stick Model",
          description:
            "A 3D skeletal representation of a structure where every member is drawn as a single line along its centroidal axis, used for structural analysis, estimation, and detailing.",
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
