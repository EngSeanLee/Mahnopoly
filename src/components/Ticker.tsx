const ITEMS = [
  "Homes Bought",
  "Homes Built",
  "Full Rehabs",
  "Lots Platted",
  "Streets Poured",
  "Epoxy Floors",
  "Rentals Managed",
  "Kansas Towns",
];

// The red scrolling band under every public hero. Purely decorative brag
// copy — deliberately generic ("Lots Platted", not a specific count) so it
// never goes stale the way a hard number would. Pure CSS marquee (two
// copies of the same list, animated -50%) — no JS, and it honors
// prefers-reduced-motion via globals.css.
export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        <TickerSet />
        <TickerSet />
      </div>
    </div>
  );
}

function TickerSet() {
  return (
    <div className="ticker-set" aria-hidden="true">
      {ITEMS.map((item) => (
        <span key={item} style={{ display: "contents" }}>
          <span className="item">{item.toUpperCase()}</span>
          <span className="dot">◆</span>
        </span>
      ))}
    </div>
  );
}
