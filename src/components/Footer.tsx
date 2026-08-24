import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer" id="contact">
      <div>
        <div className="foot-name">Mahnopoly LLC</div>
        <div className="foot-meta">
          {settings.officeAddress} &middot; {settings.officeHours}
        </div>
      </div>
      <div className="foot-phone">{settings.officePhone}</div>
    </footer>
  );
}
