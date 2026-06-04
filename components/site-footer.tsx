"use client";

import Link from "next/link";
import { TermsModal } from "@/components/terms-modal";

const LINKEDIN_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function SiteFooter({ dark = false }: { dark?: boolean }) {
  const border = dark ? "border-zinc-800" : "border-slate-100";
  const bg = dark ? "bg-zinc-900" : "bg-white";
  const label = dark ? "text-zinc-400" : "text-slate-400";
  const heading = dark ? "text-zinc-300" : "text-slate-500";
  const link = dark
    ? "text-zinc-400 hover:text-white transition-colors"
    : "text-slate-500 hover:text-[#E67E00] transition-colors";
  const logoFilter = dark ? "brightness-0 invert" : "";

  return (
    <footer className={`border-t ${border} ${bg}`}>
      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <img src="/horizontal.svg" alt="StickModel" className={`h-7 w-auto ${logoFilter}`} />
          </Link>
<div className={`text-xs leading-relaxed ${label}`}>
            <p className="font-medium mb-0.5">Registered Office</p>
            <p>Fifth Floor, C 56A/27, Sector 62,</p>
            <p>Noida, Uttar Pradesh – 201301</p>
          </div>
        </div>

        {/* Col 2 — Links */}
        <div className="flex flex-col gap-3">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${heading} mb-1`}>Quick Links</p>
          <Link href="/pricing" className={`text-sm ${link}`}>Pricing</Link>
          <Link href="/faq" className={`text-sm ${link}`}>FAQ</Link>
          <Link href="/contact" className={`text-sm ${link}`}>Contact</Link>
          <Link href="/login" className="text-sm text-[#E67E00] hover:text-orange-500 transition-colors">Get Started →</Link>
        </div>

        {/* Col 3 — Contact */}
        <div className="flex flex-col gap-3">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${heading} mb-1`}>Get in Touch</p>
          <a href="tel:+919999503168" className={`text-sm ${link}`}>+91 9999503168</a>
          <a href="mailto:shubhu@stickmodel.com" className={`text-sm ${link}`}>shubhu@stickmodel.com</a>
          <a
            href="https://www.linkedin.com/company/stick-model/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm ${link} flex items-center gap-1.5`}
          >
            {LINKEDIN_SVG}
            LinkedIn
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`max-w-6xl mx-auto px-6 py-5 border-t ${border} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${label}`}>
            © {new Date().getFullYear()} StickModel. All rights reserved.
          </span>
          <span className={`text-xs ${label}`}>·</span>
          <span className={`text-xs ${label}`}>A service of</span>
          <img
            src="/vecube-logo-white-violet.png"
            alt="Vecube"
            className={`h-4 w-auto ${dark ? "opacity-70" : "bg-zinc-900 rounded px-1.5 py-0.5 opacity-80"}`}
          />
        </div>
        <TermsModal dark={dark} />
      </div>
    </footer>
  );
}
