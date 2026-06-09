import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "BIM & ABM Compatible Stick Models — StickModel",
  description:
    "StickModel outputs are compatible with BIM workflows, ABM processes, and Tekla PowerFab. Integrate directly into your existing estimation pipeline.",
  alternates: { canonical: "https://stickmodel.com/about/bim-integration" },
};

export default function BimIntegrationPage() {
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
          BIM and ABM compatible estimation models
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          StickModel produces stick and wireframe models that integrate directly
          with BIM workflows, ABM (Advanced Bill of Material) processes, and
          industry-standard estimation platforms including Tekla PowerFab. If
          your team already works within a BIM or ABM environment, our models
          slot into your existing pipeline without requiring changes to your
          process.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          What is BIM and how StickModel fits in
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Building Information Modelling (BIM) is a process for creating and
          managing digital representations of a built asset. A StickModel
          wireframe serves as the geometric foundation for a BIM workflow —
          providing accurate structural geometry before full LOD modelling
          begins. This is particularly useful in early-stage estimation where a
          full BIM model is not yet warranted but accurate quantities are
          already needed. Our models are delivered in IFC-compatible formats
          and can be imported into major BIM platforms for further development.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          ABM workflow integration
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          ABM — Advanced Bill of Material — focuses on modelling discrete
          structural assemblies for fabrication and estimation. StickModel
          outputs are structured to support ABM workflows: members are
          logically grouped, connection points are accurately located, and
          section data is embedded where required. Estimators and fabricators
          working within an ABM process can import our models directly and
          begin assembly-level quantity extraction without rework.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Estimation model for Tekla PowerFab
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Tekla PowerFab is one of the most widely used platforms for
          structural steel estimation and fabrication management. StickModel
          produces estimation models specifically structured for import into
          Tekla PowerFab. Member geometry, section assignments, and material
          data are formatted to match PowerFab&apos;s import requirements,
          allowing your estimating team to move directly from our model into
          PowerFab for takeoff and job costing. If you currently produce
          estimation models manually or from 2D drawings, StickModel can
          significantly reduce the time from drawing receipt to model ready for
          takeoff.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Other platform compatibility
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          Beyond EPM software like Tekla PowerFab and Fab Command, StickModel
          outputs are compatible with:
        </p>
        <ul className="space-y-2 mb-6 ml-4">
          {[
            "Tekla Structures",
            "Revit (via IFC)",
            "AutoCAD (DWG 3D)",
            "SDS/2",
          ].map((platform) => (
            <li
              key={platform}
              className="flex items-start gap-3 text-slate-600"
            >
              <span className="mt-2 w-2 h-2 rounded-full bg-[#E67E00] flex-shrink-0" />
              <span>{platform}</span>
            </li>
          ))}
        </ul>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          If you use a platform not listed here, contact us and we will confirm
          compatibility before you commit to a project.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Check compatibility for your workflow
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
