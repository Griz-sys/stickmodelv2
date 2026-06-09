import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — StickModel",
  description:
    "StickModel terms of service. Please read carefully before using our platform.",
  alternates: { canonical: "https://stickmodel.com/terms" },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
