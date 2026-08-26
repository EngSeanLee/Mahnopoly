import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
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
      <div className="foot-phone">{settings.officePhone}</div>
    </footer>
  );
}
