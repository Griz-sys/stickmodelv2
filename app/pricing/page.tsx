"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Zap,
  Package,
} from "lucide-react";
import { HeroNav } from "@/components/hero-nav";
import { motion, AnimatePresence } from "framer-motion";

const PRICING_TIERS = [
  {
    range: "Up to 250 MT",
    original: "$1,000",
    discounted: "$600",
  },
  {
    range: "250 - 500 MT",
    original: "$1,500",
    discounted: "$900",
  },
  {
    range: "500 - 1,000 MT",
    original: "$2,000",
    discounted: "$1,200",
  },
  {
    range: ">1,000 MT",
    original: "$2/MT",
    discounted: "$1.2/MT",
  },
];

const FEATURES = [
  "IFC stick model file",
  "24 hour turnaround",
  "Video preview before payment",
  "Unlimited revisions",
  "Email support",
];

const FAQS = [
  {
    question: "When do I pay?",
    answer:
      "You only pay after we've created your model and you've approved the video preview. No upfront costs.",
  },
  {
    question: "What file formats do you accept?",
    answer:
      "We accept structural drawings in PDF format. Make sure your drawings are clear and legible for best results.",
  },
  {
    question: "What if I need revisions?",
    answer:
      "Upload revised set of drawings and get revised quote if any, depending on the changes.",
  },
  {
    question: "Do you offer volume discounts?",
    answer:
      "Contact us for custom enterprise pricing on ongoing partnerships and volume commitments.",
  },
];

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 mb-6">
            <Zap className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">
              40% Launch Discount
            </span>
          </div>
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-5">
            Pricing
          </p>
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-5">
            Transparent, tiered
            <span style={{ color: 'var(--color-amber-700)' }}> pricing</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Simple weight-based pricing. All prices are per project. Pay only
            after you approve the preview.
          </p>
        </motion.div>
      </section>

      {/* ── PRICING TIERS ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 + idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex"
            >
              <div
                className={`w-full rounded-2xl border-2 border-slate-200 p-8 flex flex-col transition-shadow duration-300 relative bg-white hover:shadow-xl hover:shadow-slate-100`}
              >
                <div className="mb-8">
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {tier.range}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 line-through">
                        {tier.original}
                      </span>
                      <span className="text-3xl font-bold text-slate-900">
                        {tier.discounted}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/login" className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200 bg-slate-50 text-slate-900 hover:bg-orange-600 hover:text-white hover:border-orange-600"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-on */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Advanced Bill of Materials (ABM)
              </h3>
              <p className="text-sm text-slate-500">
                Detailed material quantities & specifications
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-slate-900">$200</p>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              Add to any plan
            </p>
          </div>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-slate-500 mt-8 italic"
        >
          *All prices are per project. Launch discount of 40% available for
          limited time.
        </motion.p>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-slate-100" />
      </div>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-4">
            FAQ
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 mb-12">
            Common questions
          </h2>
        </motion.div>

        <div className="divide-y divide-slate-100">
          {FAQS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + idx * 0.06 }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4 text-slate-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {expandedFaq === idx && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-slate-500 leading-relaxed text-sm max-w-xl">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/horizontal.svg"
              alt="StickModel"
              className="h-7 w-auto"
            />
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link
              href="/#about"
              className="hover:text-orange-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="hover:text-orange-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="hover:text-orange-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
