import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact StickModel — Start Your Wireframe Project",
  description:
    "Get in touch to start your stick model or estimation model project. We typically respond within one business day.",
  alternates: { canonical: "https://stickmodel.com/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
