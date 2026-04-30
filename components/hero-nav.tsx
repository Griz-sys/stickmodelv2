"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function HeroNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-[100] border-b border-stone-100 shadow-sm">
      <nav className="max-w-[1440px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/horizontal.svg" alt="StickModel" className="h-8 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/pricing"
            className="text-stone-500 hover:text-stone-900 font-medium text-[13px] tracking-widest uppercase transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/faq"
            className="text-stone-500 hover:text-stone-900 font-medium text-[13px] tracking-widest uppercase transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-stone-500 hover:text-stone-900 font-medium text-[13px] tracking-widest uppercase transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="bg-[#E67E00] text-white px-6 py-2.5 font-bold text-[13px] tracking-widest uppercase hover:bg-[#d66c00] transition-colors"
          >
            Sign In
          </Link>
        </div>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-stone-800 transition-transform duration-200 ${
              mobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-stone-800 transition-opacity duration-200 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-stone-800 transition-transform duration-200 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
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
                href="/faq"
                className="text-stone-600 font-medium text-sm uppercase tracking-widest py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
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
                className="bg-[#E67E00] text-white px-6 py-3 font-bold text-[13px] tracking-widest uppercase text-center hover:bg-[#d66c00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
