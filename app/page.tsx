"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Unbounded } from "next/font/google";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Zap, Shield } from "lucide-react";

const unbounded = Unbounded({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
  variable: "--font-unbounded",
});

// Original custom ModelViewer â€” works well with our model
const ModelViewer = dynamic(() => import("@/components/landing/ModelViewer"), {
  ssr: false,
});

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function HeroPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    // Handle hash on load (e.g. navigating from another page via /#about)
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => scrollToSection(id), 2200);
    }
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${unbounded.variable} min-h-screen`}>
      {/* ==================== LOADING OVERLAY ==================== */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center"
        >
          <div className="relative w-16 h-16 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-slate-200 border-t-orange-600"
            />
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-600 font-medium"
          >
            Loading StickModel...
          </motion.p>
        </motion.div>
      )}

      {/* ==================== NAV ==================== */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200"
        style={{ height: "60px" }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
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
          </button>

          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
            >
              About
            </button>
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
              Get Yours !
            </Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section
        id="hero"
        className="relative h-screen w-full flex flex-col justify-center overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          paddingTop: "60px",
        }}
      >
        {/* 3D Model */}
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

        <div className="max-w-7xl mx-auto w-full h-full relative z-50">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              left: "0%",
              top: "calc(12% - 28px)",
              zIndex: 80,
              maxWidth: "950px",
              width: "90%",
              padding: "1.5rem",
            }}
          >
            <h1
              className="font-black tracking-tight text-slate-900 leading-[0.92] text-left mb-4"
              style={{
                fontSize: "clamp(3rem,6.7vw,6.75rem)",
                fontFamily:
                  "var(--font-unbounded), 'Helvetica Neue', Arial, sans-serif",
                textTransform: "uppercase",
              }}
            >
              DRAWING TO{" "}
              <span
                className="text-orange-600"
                style={{
                  fontFamily:
                    "var(--font-unbounded), 'Instrument Serif', Georgia, serif",
                  whiteSpace: "nowrap",
                  position: "relative",
                  top: "-9px",
                }}
              >
                STICK MODEL
              </span>
            </h1>

            <h2
              className="font-black tracking-tight text-slate-900 leading-[0.92] text-left mb-3"
              style={{
                fontSize: "clamp(3rem,6.7vw,6.75rem)",
                fontFamily:
                  "var(--font-unbounded), 'Helvetica Neue', Arial, sans-serif",
                textTransform: "uppercase",
                position: "relative",
                top: "-33px",
              }}
            >
              IN 24 HOURS
            </h2>

            <p
              className="text-slate-800 font-light tracking-wide"
              style={{
                fontSize: "clamp(3rem,2.25vw,2.25rem)",
                position: "relative",
                top: "-47px",
              }}
            >
              Define. Detail. Deliver.
            </p>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("about")}
        >
          <span className="text-xs text-slate-400 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-5 text-slate-400"
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

      {/* ==================== ABOUT SECTION ==================== */}
      <div id="about" className="bg-white text-slate-900">
        {/* ABOUT HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <p className="text-xs tracking-widest text-slate-400 mb-4 uppercase">
                About StickModel
              </p>
              <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-6">
                Transforming Structural Drawings Into
                <span className="text-orange-600"> Accurate Stick Models</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                StickModel helps structural detailers convert 2D drawings into
                precise IFC stick models quickly and reliably, reducing manual
                effort and eliminating costly detailing errors.
              </p>
            </div>
            <div className="rounded-xl h-[340px] overflow-hidden bg-slate-100">
              <video
                src="/Blueprint_to_D_Wireframe_Model.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
              />
            </div>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <Stat number="250+" label="Models Delivered" />
            <Stat number="20+" label="Happy Clients" />
            <Stat number="24hrs" label="Fastest Delivery" />
            <Stat number="100%" label="Accuracy Rate" />
          </div>
        </section>

        {/* MISSION */}
        <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-xl h-[380px] overflow-hidden bg-slate-100"
          >
            <img
              src="/abt.png"
              alt="Workflow Illustration"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-widest text-slate-400 mb-4 uppercase">
              Our Mission
            </p>
            <h2 className="text-3xl font-semibold mb-6">
              Simplifying Structural Detailing Workflows
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Structural detailers spend countless hours manually converting
              drawings into models. StickModel removes this bottleneck by
              providing fast, reliable stick model generation from your
              structural drawings.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our goal is simple: reduce manual work, improve model accuracy,
              and allow engineers to focus on higher-value design decisions.
            </p>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
              Why StickModel
            </p>
            <h2 className="text-3xl font-semibold">
              Designed for Structural Professionals
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap />,
                title: "Fast Turnaround",
                description:
                  "Receive accurate stick models in as little as 4 hours.",
              },
              {
                icon: <CheckCircle2 />,
                title: "Precision Modeling",
                description:
                  "Industry-standard models compatible with your workflows.",
              },
              {
                icon: <Shield />,
                title: "Secure Files",
                description:
                  "All drawings are stored and transferred securely.",
              },
              {
                icon: <Users />,
                title: "Expert Support",
                description:
                  "Our team assists you through every stage of modeling.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Feature
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
              Showcase
            </p>
            <h2 className="text-3xl font-semibold">Our Work</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-xl h-[400px] overflow-hidden bg-slate-100"
          >
            <video
              src="/main .mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-slate-50 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-6 text-center mb-16"
          >
            <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
              Process
            </p>
            <h2 className="text-3xl font-semibold">How StickModel Works</h2>
          </motion.div>
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">
            {[
              {
                number: "01",
                title: "Upload Your Drawing",
                desc: "Upload your structural PDF or drawings securely.",
              },
              {
                number: "02",
                title: "Model Generation",
                desc: "Our experts convert drawings into IFC stick models.",
              },
              {
                number: "03",
                title: "Preview Model",
                desc: "Watch a preview video of your generated model.",
              },
              {
                number: "04",
                title: "Download IFC",
                desc: "Approve and download your production-ready model.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Step number={s.number} title={s.title} desc={s.desc} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ==================== FOOTER ==================== */}
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
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-orange-600 transition-colors"
              >
                About
              </button>
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

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-slate-200 hover:shadow-lg transition">
      <CardContent className="p-6">
        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-md mb-4">
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-2xl font-semibold text-orange-600">{number}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-semibold mb-1">{number}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
