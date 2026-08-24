import { getSupabasePublicClient } from "@/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";

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
  description: string;
  photos: string[];
}

// Same placeholder data the app launched with. Used only as a fallback —
// when Supabase isn't configured (local dev without accounts set up) or a
// query fails — so the public site still runs without a database. Once the
// admin panel is in real use, the actual source of truth is the `listings`
// table; this fallback is not kept in sync with it.
const FALLBACK_LISTINGS: Listing[] = [
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
    description: "",
    photos: [],
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
    description: "",
    photos: [],
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
    description: "",
    photos: [],
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
    description: "",
    photos: [],
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
    description: "",
    photos: [],
  },
];

// DB row shape (supabase/schema.sql) differs slightly from the app-facing
// Listing type — `available_date` vs `available`, nullable text columns —
// so this mapping is the one place that difference lives.
type ListingRow = {
  id: string;
  address: string;
  neighborhood: string;
  type: ListingType;
  status: ListingStatus;
  price: number;
  beds: number;
  baths: number;
  pets: string | null;
  available_date: string | null;
  description: string | null;
  photos: string[] | null;
};

function rowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    address: row.address,
    neighborhood: row.neighborhood,
    type: row.type,
    status: row.status,
    price: Number(row.price),
    beds: row.beds,
    baths: row.baths,
    pets: row.pets ?? "—",
    available: row.available_date ?? "—",
    description: row.description ?? "",
    photos: row.photos ?? [],
  };
}

const LISTING_COLUMNS =
  "id, address, neighborhood, type, status, price, beds, baths, pets, available_date, description, photos";

export async function getListings(): Promise<Listing[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return FALLBACK_LISTINGS;

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getListings: query failed, using fallback data", error);
    return FALLBACK_LISTINGS;
  }
  return data.map(rowToListing);
}

export async function getListing(id: string): Promise<Listing | undefined> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return FALLBACK_LISTINGS.find((l) => l.id === id);

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getListing: query failed", error);
    return undefined;
  }
  return data ? rowToListing(data) : undefined;
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

// --- Admin writes -----------------------------------------------------
// These take an already-authenticated admin client (see
// src/lib/supabase/server.ts) rather than fetching one themselves, so
// every caller is explicit about running with staff privileges.

export interface ListingInput {
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
  description: string;
  photos: string[];
}

export async function createListing(
  supabase: SupabaseClient,
  input: ListingInput
) {
  return supabase.from("listings").insert({
    id: input.id,
    address: input.address,
    neighborhood: input.neighborhood,
    type: input.type,
    status: input.status,
    price: input.price,
    beds: input.beds,
    baths: input.baths,
    pets: input.pets,
    available_date: input.available,
    description: input.description,
    photos: input.photos,
  });
}

export async function updateListing(
  supabase: SupabaseClient,
  id: string,
  input: Omit<ListingInput, "id">
) {
  return supabase
    .from("listings")
    .update({
      address: input.address,
      neighborhood: input.neighborhood,
      type: input.type,
      status: input.status,
      price: input.price,
      beds: input.beds,
      baths: input.baths,
      pets: input.pets,
      available_date: input.available,
      description: input.description,
      photos: input.photos,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function deleteListing(supabase: SupabaseClient, id: string) {
  return supabase.from("listings").delete().eq("id", id);
}
