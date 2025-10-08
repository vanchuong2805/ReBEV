import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  MapPin,
  CreditCard,
  User,
  FileText,
  DollarSign,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { ordersData } from "../data/data";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const [orders] = useState(ordersData);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "shipping":
        return <Truck className="h-4 w-4 text-orange-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipping":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang giao hàng";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "refunded":
        return "Đã hoàn tiền";
      case "failed":
        return "Thanh toán thất bại";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "bank_transfer":
        return "Chuyển khoản";
      case "credit_card":
        return "Thẻ tín dụng";
      case "e_wallet":
        return "Ví điện tử";
      case "cash":
        return "Tiền mặt";
      default:
        return method;
    }
  };

  const handleViewDetails = (orderId) => {
    console.log("Viewing order details:", orderId);
    // Navigate to order details page
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.listingTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      order.paymentStatus === paymentStatusFilter;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600">
          Xem và quản lý tất cả đơn hàng trong hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter((o) => o.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.status === "processing").length}
            </p>
            <p className="text-sm text-gray-600">Đang xử lý</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter((o) => o.status === "shipping").length}
            </p>
            <p className="text-sm text-gray-600">Đang giao</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.status === "completed").length}
            </p>
            <p className="text-sm text-gray-600">Hoàn thành</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {orders.length}
            </p>
            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
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
                placeholder="Tìm kiếm theo mã đơn hàng, tên người mua/bán hoặc sản phẩm..."
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
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <Badge
                        className={`${getStatusColor(order.status)} border-0`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{order.listingTitle}</span>
                      <span>•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Người mua</p>
                    </div>
                    <p className="font-medium">{order.buyerName}</p>
                    <p className="text-xs text-gray-400">{order.buyerEmail}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Người bán</p>
                    </div>
                    <p className="font-medium">{order.sellerName}</p>
                    <p className="text-xs text-gray-400">{order.sellerEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {order.totalAmount.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Thanh toán</p>
                    </div>
                    <p className="font-medium">
                      {getPaymentMethodText(order.paymentMethod)}
                    </p>
                    <Badge
                      className={`text-xs ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.paymentStatus === "refunded"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getPaymentStatusText(order.paymentStatus)}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    </div>
                    <p className="text-sm">
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.district}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => handleViewDetails(order.id)}
                >
                  <Eye size={16} className="mr-1" />
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Không tìm thấy đơn hàng nào phù hợp với tiêu chí của bạn.
          </p>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
