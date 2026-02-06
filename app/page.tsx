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
                width="20"
                height="20"
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
            <span className="font-semibold text-lg text-slate-900">
              StickModel
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
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
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-orange-50/30">
        {/* 3D Model Full Screen */}
        <div className="absolute inset-0 z-0">
          <ModelViewer />
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center h-full px-6 md:px-12 lg:px-20 max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="font-black text-[clamp(10rem,30vw,32rem)] leading-[0.9] tracking-tight text-slate-900"
          >
            Drawing to <span className="text-orange-600">Stick Model</span>
            <br />
            in 24 Hours
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-8 text-xl md:text-2xl text-slate-700 font-light tracking-wide max-w-3xl"
          >
            Precision. Speed. Craftsmanship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 text-sm font-medium w-fit hover:bg-slate-900 transition-colors rounded-md"
            >
              Order Now
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to transform your structural drawings into
              precise digital models.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload",
                description:
                  "Drop your PDF, DWG, IFC, or DXF files. We support all major structural drawing formats.",
                icon: Upload,
              },
              {
                step: "02",
                title: "Process",
                description:
                  "Our AI analyzes your drawings and extracts structural elements automatically.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "Build",
                description:
                  "Get your digital StickModel ready for analysis and integration with your workflow.",
                icon: Package,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-orange-600/50 hover:shadow-xl hover:shadow-orange-600/10 transition-all duration-300"
              >
                <span className="text-5xl font-black text-orange-600/20">
                  {item.step}
                </span>
                <div className="mt-4 mb-3">
                  <item.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
              Join thousands of engineers who trust StickModel for their
              structural modeling needs.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-orange-600/25"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
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
