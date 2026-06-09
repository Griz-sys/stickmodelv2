import type { Metadata } from "next";
import Link from "next/link";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Estimation Models for Structural Projects — StickModel",
  description:
    "Accurate estimation models and esti-models built from 2D structural drawings. Reduce takeoff time and improve material trade-off decisions.",
  alternates: { canonical: "https://stickmodel.com/about/estimation-models" },
};

export default function EstimationModelsPage() {
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
          Structural estimation models from 2D drawings
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          An estimation model — sometimes called an esti-model — is a
          purpose-built 3D line model designed specifically to support quantity
          takeoff and cost estimation. StickModel produces estimation models
          from your 2D drawings, giving your estimating team a spatially
          accurate representation of the structure they can use to extract
          member quantities, run material trade-off analysis, and produce
          reliable cost schedules faster than working from flat drawings alone.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          What is a structural estimation model?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A structural estimation model is a simplified 3D model — typically a
          stick or wireframe representation — that captures every structural
          member, its length, section type, and connectivity. Unlike a detailed
          BIM model, an esti-model is built for speed and quantity extraction.
          It gives estimators exactly what they need: accurate geometry in three
          dimensions, fast to produce and easy to interrogate.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          How estimation models improve material takeoff
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          Material takeoff decisions — choosing between section sizes,
          connection types, or structural systems — are only as good as the
          quantity data underpinning them. When those quantities come from 2D
          drawing takeoff, errors compound. An estimation model makes material
          takeoff more reliable because quantities are extracted from geometry,
          not scaled manually. Estimators can test different section sizes
          against the same model and compare material costs with confidence.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Line model for estimation — how it works
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-14">
          A line model for estimation represents every structural member as a
          line in 3D space with its real-world length and orientation. From
          this, you can extract a complete schedule of members sorted by type
          and length, ready for pricing. StickModel produces line models
          directly from your 2D structural drawings. You send us the drawings;
          we return the model and, if required, a member schedule in your
          preferred format.
        </p>

        <h2 className="text-3xl font-semibold mb-5">
          Faster takeoff with esti-model generation
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-16">
          Traditional manual takeoff from structural drawings can take days. An
          esti-model produced by StickModel can be ready in 24 hours, and your
          estimating team can begin quantity extraction immediately. For large
          or complex structures, the time saving is substantial. For smaller
          projects, the accuracy benefit eliminates the manual scaling errors
          that routinely cause budget overruns and re-quotes.
        </p>

        <div className="border-t border-slate-200 pt-10">
          <Link
            href="/contact"
            className="inline-block bg-[#E67E00] text-white px-8 py-3 font-bold text-sm tracking-wide hover:bg-[#d66c00] transition-colors"
          >
            Get an estimation model
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
