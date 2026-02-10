"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Upload, Cpu, Package } from "lucide-react";
import dynamic from "next/dynamic";
import { Unbounded } from "next/font/google";

const unbounded = Unbounded({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
  variable: "--font-unbounded",
});

// Dynamically import ModelViewer with no SSR
const ModelViewer = dynamic(() => import("@/components/landing/ModelViewer"), {
  ssr: false,
});

export default function HeroPage() {
  return (
    <div
      className={`${unbounded.variable} min-h-screen overflow-hidden`}
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "center center",
      }}
    >
      {/* Simple Header */}
      <header className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
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
      <section className="relative h-screen w-full flex flex-col justify-center overflow-hidden">
        {/* 3D Model - Full Screen Coverage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 5,
          }}
        >
          <ModelViewer />
        </motion.div>

        {/* removed full-screen white overlay per request (keeps model untouched) */}

        <div className="max-w-7xl mx-auto w-full h-full relative z-50">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              left: "0%",
              top: "12%",
              zIndex: 80,
              maxWidth: "950px",
              width: "90%",
              padding: "1.5rem",
            }}
          >
            {/* Top Heading */}
            <h1
              className="font-black tracking-tight text-slate-900 leading-[0.92] text-left mb-4"
              style={{
                fontSize: "clamp(3rem,6.5vw,6.75rem)",
                fontFamily:
                  "var(--font-unbounded), 'Helvetica Neue', Arial, sans-serif",
                textTransform: "uppercase",
                textShadow: "none",
              }}
            >
              DRAWING TO{" "}
              <span
                className="text-orange-600"
                style={{
                  fontFamily:
                    "var(--font-unbounded), 'Instrument Serif', Georgia, 'Times New Roman', serif",
                  whiteSpace: "nowrap",
                }}
              >
                STICK MODEL
              </span>
            </h1>

            {/* 'in 24 Hours' heading */}
            <h2
              className="font-black tracking-tight text-slate-900 leading-[0.92] text-left mb-3"
              style={{
                fontSize: "clamp(2rem,6vw,5rem)",
                fontFamily:
                  "var(--font-unbounded), 'Helvetica Neue', Arial, sans-serif",
                textTransform: "uppercase",
                textShadow: "none",
              }}
            >
              IN 24 HOURS
            </h2>

            {/* Bottom Heading */}
            <p
              className="text-lg md:text-xl text-slate-800 font-light tracking-wide"
              style={{
                fontSize: "clamp(1.6875rem,2.25vw,2.25rem)",
                textShadow: "none",
              }}
            >
              Define. Detail. Deliver.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
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
