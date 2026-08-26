// The navy hero band with a slow, softly-drifting photo backdrop used on
// Home and the listings pages. `photos` cross-fade in sequence (CSS
// animation-delay, staggered) when there's more than one; a single photo
// just sits still under the drift/zoom. Decorative background only — real
// heading/CTA copy is real HTML in the section itself, not baked into an
// image (see README > "Marketing page photos").
export default function PhotoHero({
  photos,
  minHeight,
  padding,
  children,
}: {
  photos: string[];
  minHeight?: number;
  padding?: string;
  children: React.ReactNode;
}) {
  const cycle = 7 * photos.length * 3; // seconds per photo before its next turn
  return (
    <div className="photo-hero" style={{ minHeight, padding }}>
      {photos.map((src, i) => (
        <div
          key={src}
          className="photo-hero-layer"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: photos.length > 1 ? 0 : 1,
            animation:
              photos.length > 1
                ? `hero-crossfade ${cycle}s ease-in-out infinite, hero-drift 40s ease-in-out infinite alternate`
                : undefined,
            animationDelay: photos.length > 1 ? `${i * 7}s, 0s` : undefined,
          }}
        />
      ))}
      <div className="photo-hero-scrim" />
      <div className="photo-hero-body">{children}</div>
    </div>
  );
}
