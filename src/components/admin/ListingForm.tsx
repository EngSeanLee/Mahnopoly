"use client";

import { useState, useTransition } from "react";
import type { Listing } from "@/lib/listings";
import PhotoUpload from "./PhotoUpload";

type SaveResult = { ok: false; error: string } | void;

export default function ListingForm({
  listing,
  onSave,
}: {
  listing?: Listing;
  onSave: (formData: FormData) => Promise<SaveResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await onSave(formData);
      // A successful save redirects server-side and never returns here.
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit}>
      {listing && <input type="hidden" name="id" value={listing.id} />}
      <div className="two-col">
        <div className="form-row">
          <label htmlFor="address">Street address</label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={listing?.address}
            placeholder="1412 SW Clay St"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="neighborhood">Neighborhood</label>
          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            defaultValue={listing?.neighborhood}
            placeholder="SW Topeka"
          />
        </div>
        <div className="form-row">
          <label htmlFor="type">Rent or sale</label>
          <select id="type" name="type" defaultValue={listing?.type ?? "rental"}>
            <option value="rental">Rental</option>
            <option value="sale">For sale</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={listing?.status ?? "available"}>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="rented">Rented</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={listing?.price}
            placeholder="1150"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="available">Available date</label>
          <input
            id="available"
            name="available"
            type="text"
            defaultValue={listing?.available === "—" ? "" : listing?.available}
            placeholder="Sept 1"
          />
        </div>
        <div className="form-row">
          <label htmlFor="beds">Beds</label>
          <input id="beds" name="beds" type="number" min="0" step="1" defaultValue={listing?.beds} />
        </div>
        <div className="form-row">
          <label htmlFor="baths">Baths</label>
          <input id="baths" name="baths" type="number" min="0" step="0.5" defaultValue={listing?.baths} />
        </div>
        <div className="form-row">
          <label htmlFor="pets">Pets</label>
          <input
            id="pets"
            name="pets"
            type="text"
            defaultValue={listing?.pets === "—" ? "" : listing?.pets}
            placeholder="Cats only"
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={listing?.description}
          placeholder="Square footage, features, neighborhood notes…"
        />
      </div>

      <PhotoUpload initialPhotos={listing?.photos} />

      {error && <div className="form-error">{error}</div>}

      <div className="admin-actions">
        <button className="btn btn-navy" type="submit" disabled={isPending}>
          {isPending ? "Saving…" : listing ? "Save changes" : "Publish to site"}
        </button>
      </div>
    </form>
  );
}
