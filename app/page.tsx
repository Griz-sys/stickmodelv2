"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Upload, Cpu, Package } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ModelViewer with no SSR
const ModelViewer = dynamic(() => import("@/components/landing/ModelViewer"), {
  ssr: false,
});

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Simple Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center shadow-sm">
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-slate-900">
              StickModel
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="ml-3 inline-flex items-center gap-2 bg-amber-500 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-amber-600 transition-colors"
            >
              Order Now
            </Link>
          </nav>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-gradient-to-br from-slate-50 to-orange-50/30 flex flex-col justify-center px-6 overflow-hidden">
        {/* Top Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 font-black tracking-tight text-slate-900 leading-[0.92] max-w-6xl mx-auto text-left"
          style={{ fontSize: "clamp(2.8rem,7vw,6.3rem)" }}
        >
          Drawing to <span className="text-orange-600">Stick Model</span>
        </motion.h1>

        {/* Compressed Block Below */}
        <div className="-mt-6 flex flex-col items-center">
          {/* 3D Model (Smaller + Tighter) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full flex justify-center my-4"
          >
            <div className="w-[75%] max-w-3xl h-[220px] md:h-[260px] lg:h-[300px]">
              <ModelViewer />
            </div>
          </motion.div>

          {/* 'in 24 Hours' heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -60 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="font-black tracking-tight text-slate-900 leading-[0.92] text-center mb-3"
            style={{ fontSize: "clamp(2.8rem,7vw,6.3rem)" }}
          >
            in 24 Hours
          </motion.h2>

          {/* Bottom Heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -60 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-xl md:text-2xl text-slate-700 font-light tracking-wide"
          >
            Define. Detail. Deliver.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900">StickModel</span>
            </div>

            <div className="flex gap-8 text-sm text-slate-600">
              <Link
                href="/about"
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
        </div>
      </footer>
    </div>
  );
}
