import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";

// Tried on-demand revalidation first (revalidatePath("/", "layout") from
// the settings save action) to keep static pages under this layout fast
// AND fresh — verified it does NOT reliably propagate to sibling static
// routes (/about kept serving build-time data after a settings save, no
// rebuild in between). Rather than debug Next's route-group + ISR cache
// interaction further, forcing this layout dynamic is simpler and
// verified correct: every page under it (home, about, tenant-portal,
// listings) now reads Header/Footer settings fresh on every request.
// Traffic here is low enough that the static-generation speed this gives
// up isn't worth the staleness risk for a client who'll be editing these
// settings himself and expects it to just work.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="site-cursor">
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
    </div>
  );
}
