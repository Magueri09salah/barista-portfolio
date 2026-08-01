import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Editorial display face — headlines, statements, numerals */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/* Pull-quotes and the signature — a lighter, more literary serif */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-quote",
  display: "swap",
});

/* Body and UI */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/* Utility face — carries the extraction spec device (18g in · 36g out · 27s) */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-spec",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohammed Qasbili — Barista & Hospitality Professional",
  description:
    "Portfolio of Mohammed Qasbili, barista and hospitality professional in Safi, Morocco. Ten years across nine venues in Dubai and Safi: espresso, latte art, manual brewing, staff training and front of house.",
  keywords: [
    "barista",
    "specialty coffee",
    "latte art",
    "espresso",
    "V60",
    "Chemex",
    "cold brew",
    "hospitality",
    "Safi",
    "Morocco",
  ],
  authors: [{ name: "Mohammed Qasbili" }],
  openGraph: {
    title: "Mohammed Qasbili — Barista & Hospitality Professional",
    description:
      "Ten years across nine venues in Dubai and Safi, split between the restaurant floor and the espresso bar. Espresso, latte art, manual brewing and staff training.",
    type: "profile",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
