"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HeroNav } from "@/components/hero-nav";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_SECTIONS = [
  {
    title: "What It Is",
    faqs: [
      {
        question: "What exactly is a stick model / wireframe, and what does StickModel deliver?",
        answer:
          "A stick model (also called a wireframe or analytical model) is a 3D skeletal representation of a steel structure — every member (beam, column, brace) represented with correct grid and elevation. StickModel delivers this as a fully constructible 3D wireframe IFC File, ready to import into your detailing software, so your detailer can start connection design immediately without building the model from scratch. For fabricators, it also enables better quotation accuracy via an early bill of materials.",
      },
      {
        question: "What's included in a standard delivery?",
        answer:
          "Every project includes: a IFC File of your 3D Model, ready for importing in any detailing software. The model contains Primary Structural Steel in the Project.",
      },
      {
        question: "What is the Advanced Bill of Materials (ABM) add-on?",
        answer:
          "The ABM is an optional add-on ($200 per project) that provides detailed material quantities and specifications derived from the model. It is particularly useful for fabricators who need preliminary material take-offs before full detailing is complete.",
      },
    ],
  },
  {
    title: "Turnaround & Process",
    faqs: [
      {
        question: "How fast is the turnaround?",
        answer:
          "Always 24 hours — whether your project is 200 T or 2,000 T, you receive the completed wireframe package within one business day of uploading your drawings. Note: high geometric complexity or drawing readability issues may add a slight buffer to this timeline.",
      },
      {
        question: "What input drawings do you need from us?",
        answer:
          "Upload your 2D contract drawings set (PDF format) in a zip file through the secure portal. General arrangement drawings, framing plans, elevations, and grid/level information are ideal. The more complete your drawing set, the more accurate the output.",
      },
      {
        question: "How does this fit into your detailing workflow?",
        answer:
          "The stick model is the foundation layer of your 3D model. Once imported, your detailer has the full 3D geometry — correct member positions, grids, and elevations — and can immediately start adding profiles, connections, bolts, and generating shop drawings. You skip the most time-consuming setup step entirely.",
      },
      {
        question: "What if our drawings are incomplete or have missing information?",
        answer:
          "If critical information is missing (e.g., grid dimensions, member sizes, or elevations), the team will flag it and contact you before proceeding rather than making assumptions. The model will be generated based on up-to-the-mark assumptions made by our experienced detailing team to minimize changes in the future. Send as complete a drawing package as possible to avoid delays.",
      },
      {
        question: "We received revised drawings mid-project, can we resubmit?",
        answer:
          "Yes. If your engineer issues a revised drawing set, you can upload the updated drawings through the portal. Turnaround on revisions follow the same 24-hour commitment. Pricing for revision rounds depends on scope.",
      },
      {
        question: "Do you handle complex structures — multi-level, irregular framing, or curved geometry?",
        answer:
          "StickModel is built for structural steel projects of all complexities. Multi-level frames, irregular bays, sloped roofs, and braced frames are all handled. If you have an unusually complex project, reach out before uploading so expectations can be aligned.",
      },
    ],
  },
  {
    title: "Software & Accuracy",
    faqs: [
      {
        question: "Is the stick model compatible with Tekla Structures?",
        answer:
          "Yes. Delivery is specifically optimized for Tekla Structures — you receive native-compatible formats and IFC exports ready for direct import. Your detailer can open the model and begin connection detailing without any manual re-modeling.",
      },
      {
        question: "Can we use the model in other software besides Tekla?",
        answer:
          "The IFC export is a universal format supported by most structural BIM and detailing platforms (Advance Steel, Revit Structure, etc.). If you use specific software, reach out before placing an order to confirm compatibility.",
      },
      {
        question: "How accurate is the wireframe, will it match our drawings exactly?",
        answer:
          "StickModel provides perfect accuracy. Every model goes through a geometric audit cross-referenced against your original documentation before delivery. Grids, elevations, and member identifications are mapped directly from your drawings. Any information not explicitly shown in the drawings shall be interpreted in accordance with established industry standards. All such assumptions will be clearly documented and communicated at the time of submission.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    faqs: [
      {
        question: "How is pricing calculated?",
        answer:
          "Pricing is weight-based, per project. A 40% launch discount is currently active for a limited time: Up to 250 MT: $600 (normally $1,000) | 250–500 MT: $900 (normally $1,500) | 500–1,000 MT: $1,200 (normally $2,000) | Over 1,000 MT: $1.20/MT (normally $2.00/MT)",
      },
      {
        question: "When do I pay?",
        answer:
          "You pay only after you approve a preview of the model. You will not be charged until you have reviewed the wireframe and confirmed it meets your requirements.",
      },
      {
        question: "What if we need revisions after delivery?",
        answer:
          "Revisions up to a certain level are accommodated at no extra charge. Beyond that, additional charges apply based on the changes relative to the original contract documents. Based on Tonnage affected/added: $2/T for 20% to 80% of Initial Tonnage. <20% - No added Cost. >80% - Treated as a new project.",
      },
      {
        question: "Do you offer volume discounts for regular fabricators or detailing firms?",
        answer:
          "Yes, volume discounts are available. Reach out through the Contact page to discuss a recurring arrangement if you have a steady pipeline of projects.",
      },
      {
        question: "How much does this cost compared to doing wireframe modeling in-house?",
        answer:
          "StickModel reduces upfront modeling costs by approximately 60% compared to manual in-house wireframe modeling, freeing up your detailing budget for higher-value tasks like connection design and drawing production.",
      },
    ],
  },
  {
    title: "Security & Getting Started",
    faqs: [
      {
        question: "Is our drawing data secure when we upload it?",
        answer:
          "Yes. Drawings are uploaded through an encrypted portal. Your project documentation and structural data are managed securely and are not shared with third parties.",
      },
      {
        question: "How much time does StickModel actually save?",
        answer:
          "Based on benchmarked data: a 500 MT project done manually takes ~5 days — StickModel delivers in 1 day, saving 4 days. A 1,000 T project saves ~9 days, and a 2,000 T project saves ~19 days. That is time your detailers can spend on connections, shop drawings, and fabrication prep instead of building the analytical model.",
      },
      {
        question: "How do we get started?",
        answer:
          'Click "Get Started" or "Upload Now" on the website to create an account and upload your drawings through the secure portal. You can also reach out via the Contact page if you have questions before your first project.',
      },
      {
        question: "What's the next step after uploading?",
        answer:
          "After we verify your account and details, we send out an email with your credentials and request you for any Standards you would like us to follow while generation of your model and ABM. Send us the requirements and let's begin.",
      },
    ],
  },
];

export default function FAQPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-5">
            Frequently Asked Questions
          </p>
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-5">
            StickModel — <span style={{ color: "#E67E00" }}>FAQ</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about structural wireframe modeling, our process, and how StickModel fits into your workflow.
          </p>
        </motion.div>
      </section>

      {/* ── FAQ SECTIONS ── */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        {FAQ_SECTIONS.map((section, sectionIdx) => (
          <motion.div
            key={sectionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sectionIdx * 0.1 }}
            className="mb-16"
          >
            {/* Section Title */}
            <div className="mb-8 pb-6 border-b-2 border-slate-100">
              <h2
                className="text-2xl font-semibold text-slate-900"
                style={{ color: "#E67E00" }}
              >
                {section.title}
              </h2>
            </div>

            {/* FAQs in Section */}
            <div className="space-y-4">
              {section.faqs.map((faq, faqIdx) => {
                const faqId = `${sectionIdx}-${faqIdx}`;
                return (
                  <motion.div
                    key={faqId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: sectionIdx * 0.1 + faqIdx * 0.05 }}
                  >
                    <button
                      onClick={() => toggleFaq(faqId)}
                      className="w-full flex items-start justify-between py-5 px-6 text-left group border border-slate-200 rounded-lg hover:border-[#E67E00] hover:bg-[#E67E00]/5 transition-all"
                    >
                      <span className="font-medium text-slate-900 group-hover:text-[#E67E00] transition-colors pr-4">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: expandedFaq === faqId ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 text-slate-400 group-hover:text-[#E67E00] transition-colors"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedFaq === faqId && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 pt-2 text-slate-600 leading-relaxed text-sm border-l-4 border-[#E67E00]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 text-center p-8 bg-slate-50 rounded-lg border border-slate-200"
        >
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6">
            Reach out to us through the contact page or get started with your first project.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <button className="px-8 py-3 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                Contact Us
              </button>
            </Link>
            <Link href="/login?mode=signup">
              <button
                className="px-8 py-3 rounded-lg font-semibold border-2 border-[#E67E00] text-[#E67E00] hover:bg-[#E67E00] hover:text-white transition-all"
              >
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/horizontal.svg"
              alt="StickModel"
              className="h-7 w-auto"
            />
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link
              href="/#about"
              className="hover:text-[#E67E00] transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="hover:text-[#E67E00] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="hover:text-[#E67E00] transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#E67E00] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
