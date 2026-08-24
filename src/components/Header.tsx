import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

export default function Header({ settings }: { settings: SiteSettings }) {
  const telHref = `tel:${settings.officePhone.replace(/[^\d+]/g, "")}`;

  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-name">
          <span className="mah">MAH</span>
          <span className="nopoly">NOPOLY</span>
        </div>
        <div className="brand-tag">Properties for sale or rent</div>
      </div>
      <nav className="main-nav">
        <Link className="nav-link" href="/">Home</Link>
        <Link className="nav-link" href="/listings?tab=rent">For rent</Link>
        <Link className="nav-link" href="/listings?tab=sale">For sale</Link>
        <Link className="nav-link" href="/about">About</Link>
        <Link className="nav-link" href="/#contact">Contact</Link>
        <Link className="nav-staff" href="/admin/login">Staff login</Link>
      </nav>
      <a className="phone-btn" href={telHref}>{settings.officePhone}</a>
    </header>
  );
}
