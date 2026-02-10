import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { AuthenticatedNav } from "@/components/auth/authenticated-nav";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "StickModel - Structural Drawings to Stick Models",
  description:
    "Transform your structural drawings into professional stick models. Fast, accurate, and affordable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={beVietnamPro.variable}>
      <body className="antialiased min-h-screen" style={{ background: 'transparent' }}>
        {/* Fixed background image behind everything */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -9999,
            backgroundImage: "url('/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundColor: "#fafaf8",
          }}
        />

        {/* Authenticated Navigation (only shows on protected pages) */}
        <AuthenticatedNav />

        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
