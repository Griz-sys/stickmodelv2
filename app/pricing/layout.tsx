import type { Metadata } from "next";

const TITLE = "Pricing — StickModel Estimation Model Service";
const DESCRIPTION =
  "Simple, transparent pricing for wireframe and stick model generation. Pay per project or choose a plan that fits your team.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://stickmodel.com/pricing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://stickmodel.com/pricing",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
