import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { definedTermJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "What Is a Wireframe Model? — StickModel";
const DESCRIPTION =
  "A wireframe model is a 3D line representation of a structure's members, without surfaces or materials. Learn what it is, how it differs from BIM, and how to get one built.";
const PAGE_URL = `${SITE_URL}/wireframe`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What is a wireframe model?",
    answer:
      "A wireframe model is a three-dimensional line representation of a structure — beams, columns, and connections shown as 3D lines without surface fills or materials. It shows the skeleton of a structure, giving a clear spatial understanding of its geometry.",
  },
  {
    question: "How is a wireframe different from a BIM model?",
    answer:
      "A wireframe is lightweight and purpose-built for estimation, coordination, and detailing setup — it has no surfaces, materials, or fabrication-level detail. A full BIM model adds that detail and is typically used later in the project, often built on top of a wireframe as its geometric foundation.",
  },
  {
    question: "Why do wireframe models matter in construction?",
    answer:
      "A wireframe gives estimators, engineers, and detailers a single accurate source of 3D geometry to work from, instead of scaling quantities and positions from flat 2D drawings. This speeds up material takeoff, catches geometric issues before site work begins, and gives detailers a base model to build connections on.",
  },
  {
    question: "Where can I get a wireframe model built from my drawings?",
    answer:
      "StickModel builds wireframe models from your 2D structural drawings (DWG or PDF) within 24 hours. See our wireframe models service page for full details, pricing, and delivery formats.",
  },
];

export default function WireframeGlossaryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          What is a wireframe model?
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          A wireframe model is a three-dimensional line representation of a
          structure — every beam, column, and connection shown as a line in
          3D space, without surface fills, materials, or fabrication-level
          detail. It&apos;s the skeleton of a structure, used to establish accurate
          geometry before detailed modeling or fabrication begins.
        </p>

        <WireframeArt variant="cube" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">
          Wireframe vs. solid or BIM models
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A solid or full BIM model represents a structure with materials,
          surfaces, and fabrication-level detail — every bolt, connection, and
          section profile modeled explicitly. A wireframe strips all of that
          away and keeps only the line geometry: member positions, lengths,
          and connectivity. That makes it lightweight and fast to produce,
          which is exactly why it&apos;s used as the starting point for estimation
          and detailing rather than as a final deliverable.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Why wireframes matter in construction
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Working from a wireframe instead of flat 2D drawings gives every
          stakeholder — estimators, engineers, detailers, fabricators — a
          single accurate source of 3D geometry. Quantities are extracted
          from the model rather than scaled from paper, geometric issues
          surface before work begins on site, and detailers get a base model
          they can add connections to immediately.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How StickModel produces wireframe models
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          StickModel converts your 2D structural drawings into a wireframe
          model within 24 hours, delivered as an IFC file ready for import
          into Tekla Structures, Tekla PowerFab, Revit, and other major
          detailing and BIM platforms. For the full service details and
          pricing, see{" "}
          <Link href="/about/wireframe-models" className="text-[#E67E00] hover:underline">
            wireframe models for construction
          </Link>
          .
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/about/wireframe-models"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Get a wireframe model built
          </Link>
        </div>
      </main>

      <FaqSection faqs={FAQS} heading="Frequently Asked Questions" />
      <FaqJsonLd faqs={FAQS} />
      <JsonLd
        data={definedTermJsonLd({
          name: "Wireframe Model",
          description:
            "A three-dimensional line representation of a structure's members, without surfaces or materials, used for estimation, coordination, and as the geometric foundation for detailing.",
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
