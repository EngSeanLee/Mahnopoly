// Office address, phone, and hours are hardcoded placeholders for now.
// Per docs/plan.md, these become staff-editable settings once the admin
// panel and its Supabase-backed settings table exist.
export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div>
        <div className="foot-name">Mahnopoly LLC</div>
        <div className="foot-meta">Office address &middot; Topeka, KS &middot; Mon&ndash;Fri hours</div>
      </div>
      <div className="foot-phone">785.925.6505</div>
    </footer>
  );
}
