import ListingForm from "@/components/admin/ListingForm";
import { createListingAction } from "@/app/admin/(protected)/listings/actions";

export default function NewListingPage() {
  return (
    <div className="add-property-panel open">
      <h3>Adding a property — the whole form, one screen</h3>
      <ListingForm onSave={createListingAction} />
    </div>
  );
}
