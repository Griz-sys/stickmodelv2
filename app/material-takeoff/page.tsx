import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { serviceJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "Material Takeoff (MTO) for Structural Steel — StickModel";
const DESCRIPTION =
  "StickModel produces the accurate 3D geometry behind a reliable material takeoff (MTO) — built from your 2D structural drawings within 24 hours.";
const PAGE_URL = `${SITE_URL}/material-takeoff`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What is a material takeoff (MTO)?",
    answer:
      "A material takeoff (MTO) is a detailed list of the materials and quantities required for a construction project, extracted from design drawings. For structural steel, it covers member sizes, lengths, and quantities used for procurement, budgeting, and fabrication planning.",
  },
  {
    question: "How does an MTO differ from a full bill of materials (BOM)?",
    answer:
      "An MTO typically lists quantities and sizes for estimating and procurement purposes. A full Bill of Materials goes further, adding detailed specifications and structuring the data by assembly — StickModel offers this as the Advanced Bill of Materials (ABM) add-on.",
  },
  {
    question: "How does StickModel produce an accurate MTO?",
    answer:
      "We convert your 2D structural drawings into a precise 3D wireframe model. Because every member's geometry is captured accurately in 3D, quantities extracted for the MTO come from real geometry rather than manual scaling — reducing the errors that cause budget overruns and re-quotes.",
  },
  {
    question: "Who uses a material takeoff built this way?",
    answer:
      "Estimators building cost schedules, fabricators pricing jobs, and procurement teams ordering steel all use MTOs derived from an accurate 3D model rather than manual drawing takeoff.",
  },
];

export default function MaterialTakeoffPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          Material takeoff (MTO) built from accurate geometry
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          A material takeoff is only as reliable as the geometry it&apos;s drawn
          from. StickModel converts your 2D structural drawings into an
          accurate 3D wireframe model within 24 hours, giving your estimating
          team a dependable source for quantities, sizes, and procurement
          planning.
        </p>

        <WireframeArt variant="nodes" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">
          What is a material takeoff (MTO)?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A material takeoff (MTO) is a detailed list of the materials and
          quantities required for a construction project, extracted from
          design drawings. For structural steel, it covers member sizes,
          lengths, and quantities, used for procurement, budgeting, and
          fabrication planning.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How an MTO differs from a full bill of materials
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          An MTO typically covers quantities and sizes for estimating and
          procurement. A full{" "}
          <Link href="/bill-of-materials-steel" className="text-[#E67E00] hover:underline">
            bill of materials (BOM)
          </Link>{" "}
          goes further, adding detailed specifications structured by
          assembly — available from StickModel as the Advanced Bill of
          Materials (ABM) add-on.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How StickModel produces an accurate MTO
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          We convert your 2D structural drawings into a precise 3D wireframe
          model. Because every member&apos;s geometry is captured accurately in
          three dimensions, quantities extracted for the MTO come from real
          geometry rather than manual scaling off paper — reducing the
          takeoff errors that cause budget overruns and re-quotes.
        </p>

        <h2 className="text-3xl font-semibold mb-5">Who uses this</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Estimators building cost schedules, fabricators pricing jobs, and
          procurement teams ordering steel all rely on MTOs derived from an
          accurate 3D model rather than manual drawing takeoff.
        </p>

        <div className="border-t border-slate-200 pt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Get your material takeoff
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
        data={serviceJsonLd({
          name: "Material Takeoff (MTO)",
          description: DESCRIPTION,
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
