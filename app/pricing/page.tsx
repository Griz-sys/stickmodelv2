"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ChevronDown, Zap } from "lucide-react";
import { SimpleNav } from "@/components/simple-nav";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES_STANDARD = [
  "IFC stick model file",
  "~24 hour turnaround",
  "Video preview before payment",
  "Unlimited revisions",
  "Email support",
];

const FEATURES_POPULAR = [
  "Everything in Standard",
  "Detailed Bill of Materials (CSV)",
  "Material quantities & specs",
  "~24 hour turnaround",
  "Priority support",
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
      "Unlimited revisions are included. If something doesn't match your drawing, we'll fix it at no extra cost.",
  },
  {
    question: "Do you offer volume discounts?",
    answer:
      "Yes! Contact us for custom pricing on bulk projects or ongoing partnerships.",
  },
];

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SimpleNav />

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-5">
            Pricing
          </p>
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-5">
            Simple, transparent
            <span className="text-orange-600"> pricing</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Pay per project. No subscriptions, no hidden fees. You only pay
            after reviewing and approving your model.
          </p>
        </motion.div>
      </section>

      {/* ── CARDS ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Standard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="flex"
          >
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 flex flex-col transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-100">
              <div className="mb-8">
                <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
                  Standard
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                  Stick Model
                </h2>
                <p className="text-sm text-slate-500">Basic conversion</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-slate-900">$999</span>
                  <span className="text-slate-400 mb-1.5 text-sm">/ project</span>
                </div>
              </div>

              <ul className="space-y-3.5 mb-10 flex-grow border-t border-slate-100 pt-6">
                {FEATURES_STANDARD.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Popular */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            whileHover={{ y: -4 }}
            className="flex"
          >
            <div className="w-full rounded-2xl border-2 border-orange-500 bg-white p-8 flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-100/30">
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </span>
              </div>

              <div className="mb-8 pt-1">
                <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
                  With ABM
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                  Stick Model + ABM
                </h2>
                <p className="text-sm text-slate-500">
                  With Advanced Bill of Materials
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-slate-900">$1199</span>
                  <span className="text-slate-400 mb-1.5 text-sm">/ project</span>
                </div>
              </div>

              <ul className="space-y-3.5 mb-10 flex-grow border-t border-slate-100 pt-6">
                {FEATURES_POPULAR.map((f, i) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 ${i >= 1 && i <= 2 ? "text-orange-500" : "text-emerald-500"}`}
                    />
                    <span
                      className={`text-sm ${i >= 1 && i <= 2 ? "text-slate-900 font-medium" : "text-slate-600"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Guarantee note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-slate-400 mt-8"
        >
          Pay only after you approve the preview &mdash; zero risk, no upfront payment.
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
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-4">FAQ</p>
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
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900">StickModel</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/#about" className="hover:text-orange-600 transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-orange-600 transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-orange-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
