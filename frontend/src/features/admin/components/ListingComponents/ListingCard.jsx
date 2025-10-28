import { Eye, Edit, Flag, MapPin } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function ListingCard({
  listing,
  onViewDetails,
  onApprove,
  onReject,
}) {
  const STATUS = { PENDING: 0, APPROVED: 1, REJECTED: 2 };

  const media = JSON.parse(listing.media || "[]");
  console.log(typeof media);
  const url = media.find((item) => item.is_thumbnail)?.url || media[0]?.url;
  console.log(url);
  const imageUrl = url.split(" ")[1] || null;
  console.log(imageUrl);
  const getStatusIcon = (status) => {
    switch (status) {
      case 1:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 0:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đã duyệt";
      case 0:
        return "Chờ duyệt";
      case 2:
        return "Từ chối";
      default:
        return status;
    }
  };
  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image */}
        <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            <img src={imageUrl} alt="" />
          </span>
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {listing.title}
                </h3>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>ID: {listing.id}</span>
                <span>•</span>
                <span>Category: {listing.category_id}</span>
                <span>•</span>
                <div className="flex items-center">Đã xác nhận chưa</div>
              </div>
            </div>

            <Badge className={`${getStatusColor(listing.status)} border-0`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(listing.status)}
                <span>{getStatusText(listing.status)}</span>
              </div>
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-500">Người bán</p>
              <p className="font-medium">{listing.user_id} Ten Nguoi Ban</p>
              <p className="text-xs text-gray-400">{listing.user_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giá</p>
              <p className="text-lg font-bold text-blue-600">
                {listing.price.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Tạo: {new Date(listing.create_at).toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 lg:w-36">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300"
            onClick={() => onViewDetails(listing.id)}
          >
            <Eye size={16} className="mr-1" />
            Xem
          </Button>

          {(listing.status === 0 || listing.status === 1) && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject(listing.id)}
              >
                Từ chối
              </Button>
            </>
          )}

          {(listing.status === 0 || listing.status === 2) && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onApprove(listing.id)}
            >
              Phê duyệt
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
