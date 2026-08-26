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

// How many times the phrase list repeats within each half of the track.
// The loop technique (two identical halves, animate exactly -50%) is only
// seamless if each half is at least as wide as the viewport — on a wide
// enough monitor, one copy of the (short) phrase list came up short, so
// the track ran out of content before the loop point and visibly
// stalled/snapped instead of scrolling continuously. Repeating the list
// a few times per half gives enough width margin for any realistic
// screen without changing the loop math.
const REPEAT = 4;

// The red scrolling band under every public hero. Purely decorative brag
// copy — deliberately generic ("Lots Platted", not a specific count) so it
// never goes stale the way a hard number would. Pure CSS marquee (two
// identical halves, animated -50%) — no JS, and it honors
// prefers-reduced-motion via globals.css.
export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        <TickerHalf />
        <TickerHalf />
      </div>
    </div>
  );
}

function TickerHalf() {
  return (
    <div className="ticker-set" aria-hidden="true">
      {Array.from({ length: REPEAT }, (_, rep) =>
        ITEMS.map((item) => (
          <span key={`${rep}-${item}`} style={{ display: "contents" }}>
            <span className="item">{item.toUpperCase()}</span>
            <span className="dot">◆</span>
          </span>
        ))
      )}
    </div>
  );
}
