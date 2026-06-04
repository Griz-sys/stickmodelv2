"use client";

import { ScrollText } from "lucide-react";

export function TermsModal({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="/terms"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 text-sm font-semibold underline underline-offset-2 transition-colors ${
        dark
          ? "text-[#E67E00] hover:text-orange-400"
          : "text-[#E67E00] hover:text-orange-600"
      }`}
    >
      <ScrollText className="w-3.5 h-3.5" />
      Terms &amp; Conditions
    </a>
  );
}
