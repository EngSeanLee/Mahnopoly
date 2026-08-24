import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahnopoly | Homes for sale and rent in Topeka",
  description:
    "Locally owned and managed rental and for-sale listings in Topeka, KS.",
};

// Header/Footer live here because every route today is public marketing or
// listings. When the admin panel is built (needs Supabase Auth first, see
// docs/plan.md), give it its own layout under src/app/admin/ instead of
// reusing this one.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
