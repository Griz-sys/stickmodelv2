import type { FaqItem } from "@/components/faq-json-ld";

// Uses native <details>/<summary> so every answer is present in the
// server-rendered HTML and readable without JavaScript — important both
// for classic crawlers and for AI answer engines that don't execute JS.
export function FaqSection({
  faqs,
  heading,
  description,
  dark = false,
  className = "",
}: {
  faqs: FaqItem[];
  heading?: string;
  description?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section className={`${dark ? "bg-zinc-950" : "bg-white"} py-20 md:py-24 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        {heading && (
          <h2
            className={`text-3xl font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}
          >
            {heading}
          </h2>
        )}
        {description && (
          <p className={`mb-8 max-w-2xl ${dark ? "text-zinc-400" : "text-slate-500"}`}>
            {description}
          </p>
        )}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className={`group rounded-lg border px-6 py-5 transition-colors ${
                dark
                  ? "border-zinc-800 open:border-[#E67E00] open:bg-zinc-900"
                  : "border-slate-200 open:border-[#E67E00] open:bg-[#E67E00]/5"
              }`}
            >
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:content-none [&::-webkit-details-marker]:hidden ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                {faq.question}
                <span
                  className={`shrink-0 transition-transform duration-200 group-open:rotate-180 ${
                    dark ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <p
                className={`mt-3 text-sm leading-relaxed border-l-4 pl-4 ${
                  dark
                    ? "text-zinc-400 border-[#E67E00]/60"
                    : "text-slate-600 border-[#E67E00]"
                }`}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
