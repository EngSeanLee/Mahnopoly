// Small inline SVGs for the home page's path cards — plain stroke icons,
// no icon library dependency. Colored via currentColor so the existing
// .path-card / .path-card.buy CSS (which already recolors .dot) can
// recolor these the same way with one added rule.

export function KeyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="M10.5 12.5 20 3" />
      <path d="M17 6l2 2" />
      <path d="M14 9l2 2" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}
