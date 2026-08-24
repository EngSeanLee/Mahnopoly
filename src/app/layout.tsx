import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahnopoly | Homes for sale and rent in Topeka",
  description:
    "Locally owned and managed rental and for-sale listings in Topeka, KS.",
};

// Just the HTML shell. Public pages get Header/Footer from
// src/app/(site)/layout.tsx; the admin panel gets its own chrome from
// src/app/admin/layout.tsx — kept separate so staff pages never show the
// public marketing nav/footer around them.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
