// Listing data access.
//
// Today this reads the placeholder array below, ported straight from the
// review mockup's script.js. Once the Supabase project exists (see
// docs/plan.md and supabase/schema.sql), swap the body of these two
// functions to query the `listings` table instead — every page that calls
// them (home, listings, property detail) stays unchanged.

export type ListingType = "rental" | "sale";
export type ListingStatus = "available" | "rented" | "pending" | "sold";

export interface Listing {
  id: string;
  address: string;
  neighborhood: string;
  type: ListingType;
  status: ListingStatus;
  price: number;
  beds: number;
  baths: number;
  pets: string;
  available: string;
}

const PLACEHOLDER_LISTINGS: Listing[] = [
  {
    id: "clay-st",
    address: "1412 SW Clay St",
    neighborhood: "SW Topeka",
    type: "rental",
    status: "available",
    price: 1150,
    beds: 3,
    baths: 2,
    pets: "Cats only",
    available: "Sept 1",
  },
  {
    id: "burlingame-rd",
    address: "3317 SW Burlingame Rd",
    neighborhood: "NW Topeka",
    type: "rental",
    status: "available",
    price: 1400,
    beds: 4,
    baths: 2,
    pets: "Dogs & cats ok",
    available: "Sept 15",
  },
  {
    id: "indiana-ave",
    address: "2208 SE Indiana Ave",
    neighborhood: "College Hill",
    type: "rental",
    status: "rented",
    price: 875,
    beds: 2,
    baths: 1,
    pets: "No pets",
    available: "—",
  },
  {
    id: "lyman-rd",
    address: "905 NW Lyman Rd",
    neighborhood: "Westboro",
    type: "sale",
    status: "pending",
    price: 189900,
    beds: 3,
    baths: 2,
    pets: "—",
    available: "—",
  },
  {
    id: "macvicar-ave",
    address: "1725 SW MacVicar Ave",
    neighborhood: "Westboro",
    type: "sale",
    status: "available",
    price: 214500,
    beds: 4,
    baths: 3,
    pets: "—",
    available: "—",
  },
];

export async function getListings(): Promise<Listing[]> {
  return PLACEHOLDER_LISTINGS;
}

export async function getListing(id: string): Promise<Listing | undefined> {
  return PLACEHOLDER_LISTINGS.find((l) => l.id === id);
}

export function formatPrice(listing: Pick<Listing, "type" | "price">): string {
  const p = listing.price.toLocaleString();
  return listing.type === "rental" ? `$${p}/mo` : `$${p}`;
}

export const STATUS_LABEL: Record<ListingStatus, string> = {
  available: "Available",
  rented: "Rented",
  pending: "Pending",
  sold: "Sold",
};
