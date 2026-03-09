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
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={beVietnamPro.variable}>
      <body className="antialiased bg-[#fafaf8] min-h-screen">
        {/* Authenticated Navigation (only shows on protected pages) */}
        <AuthenticatedNav />

        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
