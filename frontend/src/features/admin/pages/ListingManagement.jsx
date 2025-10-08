import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Flag,
  Star,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { listingsData } from "../data/data";

const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [listings, setListings] = useState(listingsData);

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

  const handleApprove = (listingId) => {
    setListings(
      listings.map((listing) =>
        listing.id === listingId ? { ...listing, status: "approved" } : listing
      )
    );
    console.log("Approving listing:", listingId);
  };

  const handleReject = (
    listingId,
    reason = "Does not meet quality standards"
  ) => {
    setListings(
      listings.map((listing) =>
        listing.id === listingId
          ? { ...listing, status: "rejected", rejectionReason: reason }
          : listing
      )
    );
    console.log("Rejecting listing:", listingId, "Reason:", reason);
  };

  const handleToggleFeatured = (listingId) => {
    setListings(
      listings.map((listing) =>
        listing.id === listingId
          ? { ...listing, featured: !listing.featured }
          : listing
      )
    );
    console.log("Toggling featured status for listing:", listingId);
  };

  const handleDelete = (listingId) => {
    if (confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) {
      setListings(listings.filter((listing) => listing.id !== listingId));
      console.log("Deleting listing:", listingId);
    }
  };

  const handleViewDetails = (listingId) => {
    console.log("Viewing listing details:", listingId);
    // Navigate to listing details page
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý tin đăng
        </h1>
        <p className="text-gray-600">
          Xem xét, phê duyệt và quản lý tin đăng của người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {listings.filter((l) => l.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Chờ duyệt</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {listings.filter((l) => l.status === "approved").length}
            </p>
            <p className="text-sm text-gray-600">Đã duyệt</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {listings.filter((l) => l.status === "rejected").length}
            </p>
            <p className="text-sm text-gray-600">Từ chối</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {listings.filter((l) => l.featured).length}
            </p>
            <p className="text-sm text-gray-600">Nổi bật</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {listings.length}
            </p>
            <p className="text-sm text-gray-600">Tổng số tin</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo ID tin đăng, tiêu đề hoặc tên người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Motorcycle">Xe máy</option>
              <option value="Scooter">Xe ga</option>
              <option value="Car">Ô tô</option>
              <option value="Bicycle">Xe đạp</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Listings List */}
      <div className="space-y-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Listing Image */}
              <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {listing.images.length} ảnh
                </span>
              </div>

              {/* Listing Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {listing.title}
                      </h3>
                      {listing.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Nổi bật
                        </Badge>
                      )}
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
                  <Badge
                    className={`${getStatusColor(listing.status)} border-0`}
                  >
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

                {listing.status === "rejected" && listing.rejectionReason && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Lý do từ chối:</strong> {listing.rejectionReason}
                    </p>
                  </div>
                )}

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
                  onClick={() => handleViewDetails(listing.id)}
                >
                  <Eye size={16} className="mr-1" />
                  Xem
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className={`${
                    listing.featured
                      ? "border-yellow-300 text-yellow-600 bg-yellow-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleToggleFeatured(listing.id)}
                >
                  <Star size={16} className="mr-1" />
                  {listing.featured ? "Bỏ nổi bật" : "Làm nổi bật"}
                </Button>

                {listing.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(listing.id)}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Phê duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(listing.id)}
                    >
                      <XCircle size={16} className="mr-1" />
                      Từ chối
                    </Button>
                  </>
                )}

                {listing.status === "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit size={16} className="mr-1" />
                    Chỉnh sửa
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(listing.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Không tìm thấy tin đăng nào phù hợp với tiêu chí của bạn.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ListingManagement;
