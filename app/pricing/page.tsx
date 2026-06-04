"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Package,
} from "lucide-react";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";

const USD_RATE = 100; // 1 USD = 100 INR

const PRICING_TIERS = [
  {
    range: "Up to 250 TON",
    originalUSD: 1000,
    discountedUSD: 600,
  },
  {
    range: "250 - 500 TON",
    originalUSD: 1500,
    discountedUSD: 900,
  },
  {
    range: "500 - 1,000 TON",
    originalUSD: 2000,
    discountedUSD: 1200,
  },
  {
    range: ">1,000 TON",
    originalUSD: null,
    discountedUSD: null,
    originalPerUnit: 1.8,
    discountedPerUnit: 1,
  },
];

function formatPrice(amount: number, curr: "USD" | "INR") {
  if (curr === "INR") {
    return "₹" + (amount * USD_RATE).toLocaleString("en-IN");
  }
  return "$" + amount.toLocaleString("en-US");
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-100 mb-6">
            <Zap className="w-6 h-6 text-orange-600" />
            <span className="text-base font-semibold text-orange-600">
              40% Launch Discount*
            </span>
          </div>
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-5">
            Pricing
          </p>
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-5">
            Transparent, tiered
            <span style={{ color: "#E67E00" }}> pricing</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Simple weight-based pricing. All prices are per project. Pay only
            after you approve the preview.
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-semibold ${currency === "USD" ? "text-slate-900" : "text-slate-400"}`}>$ USD</span>
            <button
              onClick={() => setCurrency(currency === "USD" ? "INR" : "USD")}
              className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none"
              style={{ backgroundColor: "#E67E00" }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                style={{ transform: currency === "INR" ? "translateX(28px)" : "translateX(0)" }}
              />
            </button>
            <span className={`text-sm font-semibold ${currency === "INR" ? "text-slate-900" : "text-slate-400"}`}>₹ INR</span>
          </div>
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
                        {tier.originalUSD !== null
                          ? formatPrice(tier.originalUSD, currency)
                          : currency === "INR"
                          ? `₹${(tier.originalPerUnit! * USD_RATE).toLocaleString("en-IN")}/TON`
                          : `$${tier.originalPerUnit}/TON`}
                      </span>
                      <span className="text-3xl font-bold text-slate-900">
                        {tier.discountedUSD !== null
                          ? formatPrice(tier.discountedUSD, currency)
                          : currency === "INR"
                          ? `₹${(tier.discountedPerUnit! * USD_RATE).toLocaleString("en-IN")}/TON`
                          : `$${tier.discountedPerUnit}/TON`}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/login" className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200 bg-slate-50 text-slate-900 hover:bg-[#E67E00] hover:text-white hover:border-[#E67E00]"
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
            <div className="flex items-center justify-end gap-3">
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(200, currency)}
              </span>
              <span className="text-2xl font-bold text-slate-900">{formatPrice(120, currency)}</span>
            </div>
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
          *All prices are per project. Get a 40% launch discount for a limited
          time (valid till October 2026).
        </motion.p>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-slate-100" />
      </div>

      {/* ── CTA TO FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Have more questions?
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            Check out our comprehensive FAQ page for detailed answers about our process, software compatibility, and more.
          </p>
          <Link href="/faq">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-lg font-semibold bg-[#E67E00] text-white hover:bg-[#d66c00] transition-all"
            >
              View Full FAQ
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
