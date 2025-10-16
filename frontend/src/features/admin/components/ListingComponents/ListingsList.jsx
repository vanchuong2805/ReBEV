import { Card } from "../../../../components/ui/card";
import ListingCard from "./ListingCard";

export default function ListingsList({
  listings,
  onViewDetails,
  onApprove,
  onReject,
  onEdit,
}) {
  if (!listings.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">
          Không tìm thấy tin đăng nào phù hợp với tiêu chí của bạn.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onViewDetails={onViewDetails}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
