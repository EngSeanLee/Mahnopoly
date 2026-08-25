import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import ListingForm from "@/components/admin/ListingForm";
import { updateListingAction } from "@/app/admin/(protected)/listings/actions";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getOwners } from "@/lib/owners";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const supabase = await getSupabaseAdminClient();
  const owners = supabase ? await getOwners(supabase) : [];

  const boundUpdate = updateListingAction.bind(null, id);

  return (
    <div className="add-property-panel open">
      <h3>Edit {listing.address}</h3>
      <ListingForm listing={listing} onSave={boundUpdate} owners={owners} />
    </div>
  );
}
