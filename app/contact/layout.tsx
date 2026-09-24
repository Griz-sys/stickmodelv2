import type { Metadata } from "next";

const TITLE = "Contact StickModel — Start Your Wireframe Project";
const DESCRIPTION =
  "Get in touch to start your stick model or estimation model project. We typically respond within one business day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://stickmodel.com/contact" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "https://stickmodel.com/contact", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
