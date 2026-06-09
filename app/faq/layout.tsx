import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs — StickModel Wireframe & Estimation Models",
  description:
    "Common questions about StickModel — file formats, turnaround time, BIM compatibility, Tekla PowerFab support, and more.",
  alternates: { canonical: "https://stickmodel.com/faq" },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
