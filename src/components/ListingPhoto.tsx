import Image from "next/image";
import PhotoPlaceholder from "./PhotoPlaceholder";

// Shows a listing's photo at the given index if it exists, falling back
// to the placeholder box otherwise — most listings won't have real
// photos until staff add them via /admin, so both states need to look
// intentional, not broken.
export default function ListingPhoto({
  photos,
  index = 0,
  className = "",
  sizes,
}: {
  photos: string[];
  index?: number;
  className?: string;
  sizes?: string;
}) {
  const url = photos[index];
  if (!url) return <PhotoPlaceholder className={className} />;

  return (
    <div className={`photo-placeholder has-photo ${className}`}>
      <Image
        src={url}
        alt=""
        fill
        sizes={sizes ?? "(max-width: 640px) 100vw, 25vw"}
        style={{ objectFit: "cover" }}
        unoptimized
      />
    </div>
  );
}
