import ListingForm from "@/components/admin/ListingForm";
import { createListingAction } from "@/app/admin/(protected)/listings/actions";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getOwners } from "@/lib/owners";

export default async function NewListingPage() {
  const supabase = await getSupabaseAdminClient();
  const owners = supabase ? await getOwners(supabase) : [];

  return (
    <div className="add-property-panel open">
      <h3>Adding a property — the whole form, one screen</h3>
      <ListingForm onSave={createListingAction} owners={owners} />
    </div>
  );
}
