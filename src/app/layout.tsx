import type { Metadata } from "next";
import { Archivo, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahnopoly | Homes for sale and rent across Kansas",
  description:
    "Locally owned and managed rental and for-sale listings across Kansas.",
};

// Self-hosted via next/font (no runtime request to Google Fonts, no
// layout-shift flash) — exposed as CSS variables so globals.css can
// reference them the same way across every page, admin included.
// Archivo/IBM Plex Mono only need the weights the design actually uses;
// Instrument Serif is display-only copy so normal weight + italic style.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Just the HTML shell. Public pages get Header/Footer from
// src/app/(site)/layout.tsx; the admin panel gets its own chrome from
// src/app/admin/layout.tsx — kept separate so staff pages never show the
// public marketing nav/footer around them.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
