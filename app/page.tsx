"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Unbounded } from "next/font/google";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SimpleNav } from "@/components/simple-nav";

const unbounded = Unbounded({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
  variable: "--font-unbounded",
});

// Original custom ModelViewer — works well with our model
const ModelViewer = dynamic(() => import("@/components/landing/ModelViewer"), {
  ssr: false,
});

/* ---------- react-bits ModelViewer (had visibility issues) ----------
const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
  loading: () => null,
});
-------------------------------------------------------------------------- */

export default function HeroPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Show loading for at least 2 seconds, then fade it out
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
        backgroundPosition: "80% 80%",
      }}
    >
      {/* Loading Animation Overlay */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center"
        >
          {/* Loading Spinner */}
          <div className="relative w-16 h-16 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-slate-200 border-t-orange-600"
            />
          </div>

          {/* Loading Text */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-600 font-medium"
          >
            Loading StickModel...
          </motion.p>
        </motion.div>
      )}

      {/* Simple Minimal Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200"
        style={{ height: "60px" }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center">
              <svg
                width="14"
                height="14"
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
            <span className="font-semibold text-slate-900 text-sm">
              StickModel
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/about"
              className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
            >
              Order Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-screen w-full flex flex-col justify-center overflow-hidden"
        style={{ paddingTop: "60px" }}
      >
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

        {/* ---- react-bits ModelViewer (kept for reference) ----
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 5,
          }}
        >
          <ModelViewer
            url="/models/test-v1.glb"
            width="100%"
            height="100%"
            modelXOffset={0}
            modelYOffset={0}
            defaultZoom={5}
            enableMouseParallax={true}
            enableManualRotation={true}
            enableHoverRotation={false}
            environmentPreset="studio"
            autoFrame={true}
            fadeIn={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            ambientIntensity={0.8}
            keyLightIntensity={2}
            fillLightIntensity={1}
            rimLightIntensity={0.5}
          />
        </div>
        ---------------------------------------------------- */}

        <div className="max-w-7xl mx-auto w-full h-full relative z-50">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              left: "0%",
              top: "calc(12% - 12px)",
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
                fontSize: "clamp(3rem,6.7vw,6.75rem)",
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
                  position: "relative",
                  top: "-9px",
                }}
              >
                STICK MODEL
              </span>
            </h1>

            {/* 'in 24 Hours' heading */}
            <h2
              className="font-black tracking-tight text-slate-900 leading-[0.92] text-left mb-3"
              style={{
                fontSize: "clamp(3rem,6.7vw,6.75rem)",
                fontFamily:
                  "var(--font-unbounded), 'Helvetica Neue', Arial, sans-serif",
                textTransform: "uppercase",
                textShadow: "none",
                position: "relative",
                top: "-33px",
              }}
            >
              IN 24 HOURS
            </h2>

            {/* Bottom Heading */}
            <p
              className="text-lg md:text-xl text-slate-800 font-light tracking-wide"
              style={{
                fontSize: "clamp(3rem,2.25vw,2.25rem)",
                textShadow: "none",
                position: "relative",
                top: "-43px",
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
