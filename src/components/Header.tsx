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
        <Link className="nav-link" href="/listings?tab=rent">For Rent</Link>
        <Link className="nav-link" href="/listings?tab=sale">For Sale</Link>
        <Link className="nav-link" href="/about">About</Link>
        <Link className="nav-link" href="/epoxy">Epoxy</Link>
        <Link className="nav-link" href="/contact">Contact</Link>
        {settings.uhaulUrl && (
          <a className="nav-link" href={settings.uhaulUrl} target="_blank" rel="noopener noreferrer">
            U-Haul
          </a>
        )}
        <Link className="nav-staff" href="/admin/login">Staff Login</Link>
      </nav>
      <a className="phone-btn" href={telHref}>{settings.officePhone}</a>
    </header>
  );
}
