import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { serviceJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "Structural Steel Detailing Support — StickModel";
const DESCRIPTION =
  "StickModel delivers the accurate 3D wireframe geometry structural steel detailers need to start connection design immediately, from your 2D drawings, in 24 hours.";
const PAGE_URL = `${SITE_URL}/structural-steel-detailing`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What is structural steel detailing?",
    answer:
      "Structural steel detailing is the process of producing connection designs, shop drawings, and erection drawings for a steel structure — turning engineering design intent into fabrication-ready documentation, typically done in software like Tekla Structures.",
  },
  {
    question: "Does StickModel do full connection detailing?",
    answer:
      "No. StickModel provides the 3D wireframe geometry — correct member positions, grids, and elevations — that serves as the foundation for detailing. Your detailer imports this model and adds connections, bolts, and shop drawings on top of it, skipping the time-consuming setup step of building the base geometry from scratch.",
  },
  {
    question: "How does this speed up the detailing process?",
    answer:
      "Once the wireframe is imported into Tekla Structures, your detailer already has the full 3D geometry in place and can start connection design immediately, instead of spending days manually modeling members from 2D drawings.",
  },
  {
    question: "What software is the output compatible with?",
    answer:
      "Delivery is specifically optimized for Tekla Structures and Tekla PowerFab, with IFC exports that are also compatible with Advance Steel, Revit Structure, and other major detailing platforms.",
  },
];

export default function StructuralSteelDetailingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          Structural steel detailing support
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Structural steel detailing turns an engineer&apos;s design into
          fabrication-ready connection designs and shop drawings. That work
          depends on accurate 3D geometry as its starting point — StickModel
          produces that geometry from your 2D structural drawings within 24
          hours, so your detailer can begin connection design immediately
          instead of building the base model by hand.
        </p>

        <WireframeArt variant="frame" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">
          What is structural steel detailing?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Structural steel detailing is the process of producing connection
          designs, shop drawings, and erection drawings for a steel
          structure. Detailers work in software like Tekla Structures to
          define bolted and welded connections, member sizes, and fabrication
          details based on the structural engineer&apos;s design drawings.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How StickModel supports the detailing workflow
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Before connection detailing can begin, someone has to build the base
          3D geometry — every member positioned correctly on the right grid
          and elevation. StickModel produces exactly that: a constructible 3D
          wireframe delivered as an IFC file, ready to import into your
          detailing software. Your detailer can then focus entirely on
          connections and shop drawings, the part of the job that actually
          requires their expertise.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          From 2D drawings to detailing-ready geometry in 24 hours
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Send us your contract drawing set in DWG or PDF format, and we
          return a complete, detailing-ready wireframe within 24 hours,
          regardless of project size. Every model goes through a geometric
          audit against your original documentation before delivery.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Compatible with Tekla Structures and Tekla PowerFab
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Delivery is specifically optimized for Tekla Structures and Tekla
          PowerFab, with universal IFC exports for teams using Advance Steel,
          Revit Structure, or other major detailing platforms.
        </p>

        <div className="border-t border-slate-200 pt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Get detailing-ready geometry
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
          name: "Structural Steel Detailing Support",
          description: DESCRIPTION,
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
