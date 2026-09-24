import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { JsonLd } from "@/components/json-ld";
import { WireframeArt } from "@/components/wireframe-art";
import { serviceJsonLd, SITE_URL } from "@/lib/site-schema";

const TITLE = "Bill of Materials (BOM) for Structural Steel — StickModel";
const DESCRIPTION =
  "Add StickModel's Advanced Bill of Materials (ABM) to any project for detailed steel material quantities and specifications, derived directly from your 3D model.";
const PAGE_URL = `${SITE_URL}/bill-of-materials-steel`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    question: "What is a bill of materials (BOM) in structural steel?",
    answer:
      "A bill of materials (BOM) is a structured list of every material, member size, and specification required for a project, organized by assembly. In structural steel, it's used for procurement, fabrication planning, and cost control, going beyond a basic takeoff's quantities.",
  },
  {
    question: "What is StickModel's Advanced Bill of Materials (ABM) add-on?",
    answer:
      "The ABM is an optional add-on ($120 per project with the current launch discount, normally $200) that provides detailed material quantities and specifications derived directly from your 3D wireframe model. It's particularly useful for fabricators who need preliminary material take-offs before full detailing is complete.",
  },
  {
    question: "What's included in the ABM add-on?",
    answer:
      "The ABM adds detailed material quantities and specifications on top of your standard wireframe delivery, structured for use in estimating and procurement — sized and organized so fabricators can move directly into pricing and ordering.",
  },
  {
    question: "How do I add a BOM to my project?",
    answer:
      "Select the Advanced Bill of Materials (ABM) add-on when creating your project, or add it to an existing project by reaching out through the Contact page. It can be added to any pricing tier.",
  },
];

export default function BillOfMaterialsSteelPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
          Bill of materials (BOM) for structural steel
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          A reliable bill of materials starts with accurate geometry.
          StickModel&apos;s Advanced Bill of Materials (ABM) add-on derives
          detailed steel material quantities and specifications directly from
          your 3D wireframe model — no manual re-measurement required.
        </p>

        <WireframeArt variant="list" className="mb-16" />

        <h2 className="text-3xl font-semibold mb-5">
          What is a bill of materials (BOM) in structural steel?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A bill of materials (BOM) is a structured list of every material,
          member size, and specification required for a project, organized by
          assembly. It goes beyond a basic{" "}
          <Link href="/material-takeoff" className="text-[#E67E00] hover:underline">
            material takeoff
          </Link>{" "}
          by adding the specification detail fabricators and procurement
          teams need for ordering and cost control.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          StickModel&apos;s Advanced Bill of Materials (ABM) add-on
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          The ABM is an optional add-on — $120 per project with the current
          launch discount (normally $200) — that provides detailed material
          quantities and specifications derived directly from your 3D model.
          It&apos;s particularly useful for fabricators who need preliminary
          material take-offs before full detailing is complete.
        </p>

        <h2 className="text-3xl font-semibold mb-5">What&apos;s included</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          The ABM adds detailed material quantities and specifications on top
          of your standard wireframe delivery, structured for estimating and
          procurement so your team can move straight from the model into
          pricing and ordering.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How to add it to your project
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Select the ABM add-on when creating a new project, or contact us to
          add it to an existing one. It can be added to any pricing tier —
          see the full{" "}
          <Link href="/pricing" className="text-[#E67E00] hover:underline">
            pricing page
          </Link>{" "}
          for details.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Add a bill of materials
          </Link>
        </div>
      </main>

      <FaqSection faqs={FAQS} heading="Frequently Asked Questions" />
      <FaqJsonLd faqs={FAQS} />
      <JsonLd
        data={serviceJsonLd({
          name: "Bill of Materials (BOM) for Structural Steel",
          description: DESCRIPTION,
          url: PAGE_URL,
        })}
      />

      <SiteFooter />
    </div>
  );
}
