// Stands in for a real property photo until staff upload one. Once photos
// exist (see docs/plan.md, Next/Image handles resizing), swap this for an
// <Image> pointed at the listing's photo URL and keep this as the fallback
// for listings with no photos yet.
export default function PhotoPlaceholder({
  label = "property photo",
  className = "",
  height,
}: {
  label?: string;
  className?: string;
  // .hero and .gallery give this a height via CSS; anywhere else (e.g.
  // the About page) it collapses flat without one.
  height?: number;
}) {
  return (
    <div className={`photo-placeholder ${className}`} style={height ? { height } : undefined}>
      <span className="ph-icon" /> {label}
    </div>
  );
}
