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
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
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
            {listing.images.length} ảnh
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

                {listing.reportCount > 0 && (
                  <Badge className="bg-orange-100 text-orange-800 border-0">
                    <Flag className="h-3 w-3 mr-1" />
                    {listing.reportCount} Báo cáo
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{listing.id}</span>
                <span>•</span>
                <span>{listing.category}</span>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {listing.location}
                </div>
                <span>•</span>
                <span>{listing.views} lượt xem</span>
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
              <p className="font-medium">{listing.userName}</p>
              <p className="text-xs text-gray-400">{listing.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giá</p>
              <p className="text-lg font-bold text-blue-600">
                {listing.price.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500 mb-1">Mô tả</p>
            <p className="text-gray-700 text-sm line-clamp-2">
              {listing.description}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Tạo: {new Date(listing.createdAt).toLocaleString("vi-VN")}
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

          {listing.status === "pending" && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(listing.id)}
              >
                Phê duyệt
              </Button>
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

          {listing.status === "approved" && (
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => onViewDetails(listing.id)} // hoặc mở modal edit
            >
              <Edit size={16} className="mr-1" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
