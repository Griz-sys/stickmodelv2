"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const ModelViewer = dynamic(() => import("@/components/landing/ModelViewer"), {
  ssr: false,
});
const LoadingAnimation = dynamic(
  () => import("@/components/landing/LoadingAnimation"),
  { ssr: false },
);

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-white"
          >
            <LoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white sticky top-0 z-[100] border-b border-stone-100 shadow-sm">
        <nav className="max-w-[1440px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/horizontal.svg"
              alt="StickModel"
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/pricing"
              className="text-stone-500 hover:text-stone-900 font-medium text-[13px] tracking-widest uppercase transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-stone-500 hover:text-stone-900 font-medium text-[13px] tracking-widest uppercase transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="bg-[#E67E00] text-white px-6 py-2.5 font-bold text-[13px] tracking-widest uppercase hover:bg-[#904D00] transition-colors"
            >
              Get Started
            </Link>
          </div>
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-stone-800 transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-stone-800 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-stone-800 transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </nav>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                <Link
                  href="/pricing"
                  className="text-stone-600 font-medium text-sm uppercase tracking-widest py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="text-stone-600 font-medium text-sm uppercase tracking-widest py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="bg-[#E67E00] text-white px-6 py-3 font-bold text-[13px] tracking-widest uppercase text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO */}
        <section
          className="relative overflow-hidden bg-[#fcf9f8]"
          style={{
            minHeight: "calc(100svh - 64px)",
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 5 }}
          >
            <ModelViewer />
          </motion.div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-8 flex flex-col justify-center min-h-[calc(100svh-64px)] py-20 -mt-[45px]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[#904D00] italic text-lg md:text-xl mb-5"
            >
              Define. Detail. Deliver.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-bold uppercase tracking-tight leading-[0.9] text-stone-900 mb-6 max-w-4xl"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(2.6rem, 7vw, 6.5rem)",
              }}
            >
              DRAWING TO STICK MODEL IN 24 HOURS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-stone-600 text-lg md:text-[1.35rem] leading-relaxed italic mb-10 max-w-2xl"
            >
              Convert your structural drawings into constructible, Tekla-ready
              wireframes with 100% accuracy and a 24-hour turnaround.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/login"
                className="bg-[#E67E00] text-white px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-[#904D00] transition-colors text-center"
              >
                Upload Now
              </Link>
              <Link
                href="/contact"
                className="bg-stone-900 text-white px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-stone-800 transition-colors text-center"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-stone-400 tracking-widest uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-5 h-5 text-stone-400"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* VIDEO */}
        <section className="bg-zinc-950">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-12 md:pt-16">
            <div className="border border-zinc-700 overflow-hidden">
              <video
                src="/Stickmodel_Final_Video.mp4"
                className="w-full aspect-video object-cover block"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-5">
            <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em] text-center italic">
              &lt; watch workflow demo &gt;
            </p>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
              <div className="md:col-span-4 border-l-4 border-[#E67E00] pl-6">
                <span className="text-[#904D00] font-bold uppercase tracking-[0.2em] text-xs">
                  The Toolkit
                </span>
                <h2
                  className="font-bold text-3xl md:text-4xl mt-3 leading-tight"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  What You Get
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-stone-500 text-lg md:text-xl italic leading-relaxed mb-10">
                  Every delivery provides a complete digital framework of your
                  project, ready for immediate use in your detailing workflow.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[
                    {
                      icon: "◆",
                      title: "Constructible 3D Wireframes",
                      desc: "Full 3D geometric representations of every structural member with node-perfect accuracy.",
                    },
                    {
                      icon: "⊞",
                      title: "Automated Grid Systems",
                      desc: "Precise coordinate mapping and grid alignment based directly on your project documentation.",
                    },
                    {
                      icon: "≡",
                      title: "Levels & Elevations",
                      desc: "Correct Elevations Job for every floor and support structure, eliminating manual input errors.",
                    },
                    {
                      icon: "#",
                      title: "Member Identification",
                      desc: "Intelligent labeling of beams, columns, and braces for seamless downstream detailing.",
                    },
                    {
                      icon: "✦",
                      title: "Ready for Tekla",
                      desc: "Native formats and IFC exports optimized specifically for immediate Tekla Structures import.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="space-y-3">
                      <div className="text-[#904D00] text-2xl font-bold">
                        {item.icon}
                      </div>
                      <h3
                        className="font-bold text-lg"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-hidden pt-12 md:pt-16">
              <video
                src="/Blueprint_to_D_Wireframe_Model.mp4"
                className="w-full h-[280px] md:h-[420px] object-cover grayscale brightness-75 contrast-125"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </section>

        {/* EFFICIENCY TABLE */}
        <section className="bg-zinc-950 text-white py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
              <div>
                <span className="text-[#E67E00] font-bold uppercase tracking-[0.2em] text-xs">
                  Benchmarking Performance
                </span>
                <h2
                  className="font-bold mt-3"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#ffffff",
                    fontSize: "clamp(1.5rem, 4.5vw, 5.5rem)",
                    lineHeight: "1.1",
                  }}
                >
                  Proven Efficiency Gains
                </h2>
              </div>
              <p className="text-zinc-400 italic text-base md:text-lg lg:text-right">
                Our technology facilitates faster delivery across all project
                scales, allowing you to move to fabrication sooner.
              </p>
            </div>
            <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
              <table className="w-full border-collapse min-w-[520px]">
                <thead>
                  <tr className="border-b-2 border-zinc-800">
                    {[
                      { label: "Project Size", hi: false },
                      { label: "Manual Process", hi: false },
                      { label: "StickModel Delivery", hi: true },
                      { label: "Time Saved", hi: false },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className={`text-left py-5 px-4 uppercase tracking-widest text-xs ${col.hi ? "text-[#E67E00]" : "text-zinc-500"}`}
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Small (~500 MT)", "7 Days", "5 Days", "2 Days"],
                    ["Medium (~1000 MT)", "14 Days", "10 Days", "4 Days"],
                    ["Large (~2000 MT)", "28 Days", "20 Days", "8 Days"],
                  ].map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-zinc-800 hover:bg-zinc-900 transition-colors"
                    >
                      <td className="py-7 px-4 font-bold">{row[0]}</td>
                      <td className="py-7 px-4 text-zinc-400">{row[1]}</td>
                      <td className="py-7 px-4 font-bold text-[#E67E00]">
                        {row[2]}
                      </td>
                      <td className="py-7 px-4 text-zinc-300">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 flex items-start gap-3 text-[#E67E00]">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <p
                className="font-bold text-base md:text-lg uppercase tracking-wider"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Our in-house systems enable 3.0x faster delivery for core
                wireframe modeling tasks. StickModel delivery is always 24 hours,
                regardless of project size.
              </p>
            </div>
          </div>
        </section>

        {/* WHY SPEED MATTERS */}
        <section className="bg-[#fcf9f8] py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row items-start gap-12 md:gap-16">
              <div className="hidden md:flex w-full md:w-1/2 shrink-0">
                <div className="w-full overflow-hidden">
                  <img
                    src="/abt.jpg"
                    alt="Engineering blueprints"
                    className="w-full h-[420px] object-cover block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-10">
                <div>
                  <span className="text-[#904D00] font-bold uppercase tracking-[0.2em] text-xs">
                    The 60% Advantage
                  </span>
                  <h2
                    className="font-bold text-4xl md:text-5xl mt-3 leading-tight"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Why Speed Matters
                  </h2>
                  <p className="text-stone-500 mt-5 text-base md:text-lg italic">
                    Manual wireframe modeling is a bottleneck that delays
                    fabrication and increases labor costs. Our system eliminates
                    this delay.
                  </p>
                </div>
                <div className="space-y-10">
                  {[
                    {
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      ),
                      title: "Unmatched Turnaround",
                      desc: "From project receipt to full delivery in just 24 hours, regardless of project complexity.",
                    },
                    {
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ),
                      title: "Cost Efficiency",
                      desc: "Reduce up-front modeling costs by 60%, allowing budget reallocation to critical detailing tasks.",
                    },
                    {
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ),
                      title: "Human-Level Precision",
                      desc: "Automated QA checks combined with expert oversight ensure error-free structural geometry.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-5">
                      <div className="shrink-0 w-11 h-11 bg-[#E67E00] text-white flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h4
                          className="font-bold text-lg mb-1.5"
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-stone-500 italic text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/login"
                  className="block sm:inline-block bg-zinc-900 text-white px-10 py-4 font-bold uppercase text-sm tracking-widest hover:bg-black transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-stone-100 py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-[#904D00] font-bold uppercase tracking-[0.2em] text-xs">
                Simple &amp; Secure
              </span>
              <h2
                className="font-bold text-4xl md:text-5xl mt-3 mb-5 uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                How It Works
              </h2>
              <p className="text-stone-500 text-lg italic">
                {
                  "We've streamlined the process so you can focus on engineering while we handle the foundation."
                }
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  num: "01",
                  title: "Upload Your Drawing",
                  desc: "Securely upload your 2D PDF or CAD structural plans via our encrypted portal.",
                },
                {
                  num: "02",
                  title: "Proprietary Modeling",
                  desc: "Our automated systems generate the core 3D wireframe based on your exact specs.",
                },
                {
                  num: "03",
                  title: "Quality Validation",
                  desc: "Every model undergoes a rigorous geometric audit against your original documentation.",
                },
                {
                  num: "04",
                  title: "24-Hour Delivery",
                  desc: "Receive your constructible wireframe package ready for import into your detailing software.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-4"
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center bg-[#E67E00] text-white font-bold text-xl shrink-0"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="font-bold text-lg"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-16">
              <Link
                href="/login"
                className="w-full sm:w-auto text-center bg-[#E67E00] text-white px-12 py-5 font-bold uppercase text-sm tracking-[0.2em] hover:bg-[#904D00] transition-colors"
              >
                Start Project
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#E67E00] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 text-center text-white">
            <h2
              className="font-bold mb-6 tracking-tighter uppercase"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(3.5rem, 6vw, 9rem)",
                lineHeight: "0.92",
                color: "#ffffff",
              }}
            >
              Construct Your Future
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto italic opacity-90">
              Ready to transform your structural workflow? Start your first
              precision model project today.
            </p>
            <Link
              href="/login"
              className="inline-block w-full sm:w-auto bg-zinc-900 text-white px-12 py-5 font-bold uppercase text-sm tracking-[0.2em] hover:bg-black hover:-translate-y-0.5 transition-all text-center"
            >
              Request Access
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-12 flex flex-col md:flex-row gap-10 md:gap-16 justify-between items-center md:items-start">
          <div className="space-y-5 flex flex-col items-center md:items-start">
            <Link href="/">
              <img
                src="/horizontal.svg"
                alt="StickModel"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] text-center md:text-left">
              © {new Date().getFullYear()} StickModel. Precision Engineered.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-center md:text-left">
            <div className="flex flex-col space-y-3">
              <span className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">
                Company
              </span>
              <Link
                href="/about"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Pricing
              </Link>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">
                Resources
              </span>
              <Link
                href="/terms"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">
                Connect
              </span>
              <Link
                href="/login"
                className="text-[#E67E00] italic transition-colors text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
