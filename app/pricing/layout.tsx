import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — StickModel Estimation Model Service",
  description:
    "Simple, transparent pricing for wireframe and stick model generation. Pay per project or choose a plan that fits your team.",
  alternates: { canonical: "https://stickmodel.com/pricing" },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
