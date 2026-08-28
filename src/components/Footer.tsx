import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const telHref = `tel:${settings.officePhone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="site-footer" id="contact">
      <div>
        <Link href="/" aria-label="Mahnopoly LLC — home" className="foot-logo-link">
          <Image
            src="/redesign/logo-white.png"
            alt="Mahnopoly LLC"
            width={1003}
            height={190}
            className="foot-logo"
          />
        </Link>
        <div className="foot-meta">
          {settings.officeAddress}
          <br />
          {settings.officeHours}
        </div>
      </div>
      <nav className="foot-nav" aria-label="More pages">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/mahtropolis">Mahtropolis</Link>
      </nav>
      <a className="foot-phone" href={telHref}>{settings.officePhone}</a>
    </footer>
  );
}
