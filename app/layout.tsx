import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { AuthenticatedNav } from "@/components/auth/authenticated-nav";
import { JsonLd } from "@/components/json-ld";
import { ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, SITE_URL } from "@/lib/site-schema";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});

const SITE_TITLE = "StickModel - Structural Drawings to Stick Models";
const SITE_DESCRIPTION =
  "Transform your structural drawings into professional stick models. Fast, accurate, and affordable.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | StickModel",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "UK6l2CzqqL9tHYx3l72QMLEVPp3Sj6eM4C_CL8luPDU",
  },
  openGraph: {
    type: "website",
    siteName: "StickModel",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/horizontal.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/horizontal.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={beVietnamPro.variable}>
      <head>
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <JsonLd data={WEBSITE_JSON_LD} />
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
