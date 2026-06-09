import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — StickModel",
  description: "Log in to your StickModel account.",
  alternates: { canonical: "https://stickmodel.com/login" },
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
