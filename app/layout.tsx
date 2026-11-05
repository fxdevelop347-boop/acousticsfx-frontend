import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  Poppins,
  Playfair_Display,
  Work_Sans,
  Inter,
  Plus_Jakarta_Sans,
  Manrope,
  Lato,
} from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { getPublicApiBaseUrl } from "@/lib/public-api-base";
import { SITE_URL } from "@/lib/site-url";
import { SEO_KEYWORDS_GLOBAL } from "@/lib/seo-keywords";

const apiOrigin = (() => {
  try {
    return new URL(getPublicApiBaseUrl()).origin;
  } catch {
    return null;
  }
})();

/* ================= Geist ================= */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ================= Poppins ================= */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

/* ================= Playfair Display ================= */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

/* ================= Work Sans ================= */
const worksans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-worksans",
  display: "swap",
});

/* ================= Inter ================= */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/* ================= Plus Jakarta Sans ================= */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plusjakarta",
  display: "swap",
});

/* ================= Manrope ================= */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

/* ================= Lato ================= */
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Acoustic Panels & Soundproofing Solutions | FX Acoustics India",
    template: "%s | FX Acoustics",
  },
  description:
    "FX Acoustics offers premium acoustic panels, soundproofing systems, and hardwood flooring for offices, studios, auditoriums and hospitality spaces across India. 15+ years of expertise.",
  keywords: SEO_KEYWORDS_GLOBAL,
  openGraph: {
    title:
      "Acoustic Panels & Soundproofing Solutions | FX Acoustics India",
    description:
      "FX Acoustics offers premium acoustic panels, soundproofing systems, and hardwood flooring for offices, studios, auditoriums and hospitality spaces across India. 15+ years of expertise.",
    url: SITE_URL,
    siteName: "FX Acoustics",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "PASTE_YOUR_CODE_HERE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {apiOrigin ? (
          <>
            <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={apiOrigin} />
          </>
        ) : null}
      </head>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${poppins.variable}
          ${playfair.variable}
          ${worksans.variable}
          ${inter.variable}
          ${plusJakarta.variable}
          ${manrope.variable}
          ${lato.variable}
          antialiased
        `}
      >
        <Analytics />
        <GoogleAnalytics />
        <SpeedInsights />
        <Header />
        {/* Without this boundary, React error #418 occasionally fired at <main> (9 of 1500 test loads on Next 16.1.1, 0 of 1500 with it). */}
        <main><Suspense>{children}</Suspense></main>
        <Footer />
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
