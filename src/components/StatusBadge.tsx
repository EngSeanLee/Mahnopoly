import { ListingStatus, STATUS_LABEL } from "@/lib/listings";

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={`status-badge status-${status}`}>{STATUS_LABEL[status]}</span>
  );
}
