import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WNYVYDR25Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WNYVYDR25Z');
          `}
        </Script>
      </head>
      <body className="antialiased bg-[#fafaf8] min-h-screen">
        {/* Authenticated Navigation (only shows on protected pages) */}
        <AuthenticatedNav />

        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
