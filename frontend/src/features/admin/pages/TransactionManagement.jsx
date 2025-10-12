import { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  Calendar,
  User,
  Package,
  ShoppingCart,
  X,
  Check,
} from "lucide-react";

const TransactionManagement = () => {
  const [activeTab, setActiveTab] = useState("completed");
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);

  // Filter states
  const [completedFilter, setCompletedFilter] = useState("all");
  const [depositFilter, setDepositFilter] = useState("all");
  const [complaintFilter, setComplaintFilter] = useState("all");

  // Mock data
  const [completedOrders, setCompletedOrders] = useState([
    {
      id: "ORD-001",
      productName: "Xe máy điện VinFast Klara S",
      category: "xe-may-dien",
      buyerName: "Nguyễn Văn A",
      sellerName: "Trần Thị B",
      amount: 45000000,
      completedDate: "2024-10-10",
      orderId: "ORDER-001",
    },
    {
      id: "ORD-002",
      productName: "Pin xe máy điện 60V",
      category: "pin-xe-may-dien",
      buyerName: "Lê Văn C",
      sellerName: "Phạm Thị D",
      amount: 8500000,
      completedDate: "2024-10-08",
      orderId: "ORDER-002",
    },
  ]);

  const [depositOrders, setDepositOrders] = useState([
    {
      id: "DEP-001",
      productName: "Xe máy điện Honda",
      buyerName: "Trần Văn E",
      sellerName: "Nguyễn Thị F",
      depositAmount: 5000000,
      totalAmount: 50000000,
      status: "pending",
      depositDate: "2024-10-11",
      appointmentDate: "2024-10-15",
      depositPdf: "/contracts/DEP-001.pdf",
    },
    {
      id: "DEP-002",
      productName: "Pin xe máy điện Lithium",
      buyerName: "Hoàng Văn G",
      sellerName: "Võ Thị H",
      depositAmount: 1000000,
      totalAmount: 10000000,
      status: "seller_cancelled",
      depositDate: "2024-10-09",
      appointmentDate: "2024-10-13",
      depositPdf: "/contracts/DEP-002.pdf",
    },
  ]);

  const [complaints, setComplaints] = useState([
    {
      id: "COMP-001",
      customerName: "Nguyễn Văn I",
      productId: "PROD-001",
      orderId: "ORDER-003",
      reason: "Sản phẩm không đúng mô tả",
      createdDate: "2024-10-12",
      status: "pending",
      description: "",
      productInfo: {
        name: "Xe máy điện VinFast Ludo",
        price: 25000000,
        images: ["/images/product1.jpg", "/images/product2.jpg"],
      },
    },
  ]);

  const tabs = [
    { id: "completed", label: "Đơn thành công", icon: CheckCircle },
    { id: "deposits", label: "Đơn đặt cọc", icon: Clock },
    { id: "complaints", label: "Đơn khiếu nại", icon: AlertTriangle },
  ];

  const categoryOptions = [
    { value: "all", label: "Tất cả" },
    { value: "xe-may-dien", label: "Xe máy điện" },
    { value: "pin-xe-may-dien", label: "Pin xe máy điện" },
  ];

  const depositStatusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "seller_cancelled", label: "Bên bán hủy" },
    { value: "buyer_cancelled", label: "Bên mua hủy" },
    { value: "completed", label: "Giao dịch thành công" },
  ];

  const complaintStatusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "approved", label: "Đồng ý" },
    { value: "rejected", label: "Từ chối" },
  ];

  const handleDepositStatusChange = (depositId, newStatus) => {
    setDepositOrders((prev) =>
      prev.map((order) => {
        if (order.id === depositId) {
          const updatedOrder = { ...order, status: newStatus };

          if (newStatus === "completed") {
            const newCompletedOrder = {
              id: `ORD-${Date.now()}`,
              productName: order.productName,
              category: "xe-may-dien",
              buyerName: order.buyerName,
              sellerName: order.sellerName,
              amount: order.totalAmount,
              completedDate: new Date().toISOString().split("T")[0],
              orderId: `ORDER-${Date.now()}`,
            };
            setCompletedOrders((prev) => [...prev, newCompletedOrder]);
          }

          return updatedOrder;
        }
        return order;
      })
    );
    setSelectedDeposit(null);
  };

  const handleComplaintStatusChange = (
    complaintId,
    newStatus,
    description = ""
  ) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: newStatus, description }
          : complaint
      )
    );
    setSelectedComplaint(null);
    setShowComplaintDetail(false);
  };

  const filteredCompletedOrders = completedOrders.filter(
    (order) => completedFilter === "all" || order.category === completedFilter
  );

  const filteredDepositOrders = depositOrders.filter(
    (order) => depositFilter === "all" || order.status === depositFilter
  );

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaintFilter === "all" || complaint.status === complaintFilter
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ xử lý" },
      completed: { color: "bg-green-100 text-green-800", text: "Hoàn thành" },
      seller_cancelled: {
        color: "bg-red-100 text-red-800",
        text: "Bên bán hủy",
      },
      buyer_cancelled: {
        color: "bg-orange-100 text-orange-800",
        text: "Bên mua hủy",
      },
      approved: { color: "bg-green-100 text-green-800", text: "Đồng ý" },
      rejected: { color: "bg-red-100 text-red-800", text: "Từ chối" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const renderCompletedOrders = () => (
    <div className="space-y-4">
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo danh mục:
        </label>
        <select
          value={completedFilter}
          onChange={(e) => setCompletedFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người mua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hoàn thành
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompletedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.buyerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.sellerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.amount.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.completedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDepositOrders = () => (
    <div className="space-y-4">
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo trạng thái:
        </label>
        <select
          value={depositFilter}
          onChange={(e) => setDepositFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {depositStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người mua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền cọc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepositOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.buyerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.depositAmount.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.status === "pending" && (
                      <button
                        onClick={() => setSelectedDeposit(order)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Xử lý
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Detail Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chi tiết đơn đặt cọc</h3>
              <button
                onClick={() => setSelectedDeposit(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã đơn hàng
                  </label>
                  <p className="text-sm text-gray-900">{selectedDeposit.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Đơn đặt cọc
                  </label>
                  <a
                    href={selectedDeposit.depositPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Xem PDF
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày giao dịch
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedDeposit.depositDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày hẹn
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedDeposit.appointmentDate}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() =>
                    handleDepositStatusChange(
                      selectedDeposit.id,
                      "buyer_cancelled"
                    )
                  }
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Bên mua hủy
                </button>
                <button
                  onClick={() =>
                    handleDepositStatusChange(
                      selectedDeposit.id,
                      "seller_cancelled"
                    )
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Bên bán hủy
                </button>
                <button
                  onClick={() =>
                    handleDepositStatusChange(selectedDeposit.id, "completed")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Giao dịch thành công
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-4">
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo trạng thái:
        </label>
        <select
          value={complaintFilter}
          onChange={(e) => setComplaintFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {complaintStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã khiếu nại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lý do
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {complaint.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.status === "pending" && (
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Xử lý
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Summary Modal */}
      {selectedComplaint && !showComplaintDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thông tin khiếu nại</h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên khách hàng
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedComplaint.customerName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã sản phẩm
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedComplaint.productId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã đơn hàng
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedComplaint.orderId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày tạo
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedComplaint.createdDate}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lý do
                </label>
                <p className="text-sm text-gray-900">
                  {selectedComplaint.reason}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowComplaintDetail(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && showComplaintDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chi tiết khiếu nại</h3>
              <button
                onClick={() => {
                  setShowComplaintDetail(false);
                  setSelectedComplaint(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Thông tin sản phẩm
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">
                    {selectedComplaint.productInfo.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Giá:{" "}
                    {selectedComplaint.productInfo.price.toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </p>
                </div>
              </div>

              {/* Product Images */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Hình ảnh sản phẩm
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedComplaint.productInfo.images.map((image, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 h-48 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-gray-500">
                        Hình ảnh {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complaint Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên khách hàng
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedComplaint.customerName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedComplaint.createdDate}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do khiếu nại
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedComplaint.reason}
                  </p>
                </div>
              </div>

              {/* Response */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả (Phản hồi cho khách hàng)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Nhập phản hồi cho khách hàng..."
                  value={selectedComplaint.description}
                  onChange={(e) =>
                    setSelectedComplaint({
                      ...selectedComplaint,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() =>
                    handleComplaintStatusChange(
                      selectedComplaint.id,
                      "approved",
                      selectedComplaint.description
                    )
                  }
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Đồng ý
                </button>
                <button
                  onClick={() =>
                    handleComplaintStatusChange(
                      selectedComplaint.id,
                      "rejected",
                      selectedComplaint.description
                    )
                  }
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <X size={16} className="mr-2" />
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý giao dịch</h1>
        <p className="text-gray-600">Quản lý đơn hàng, đặt cọc và khiếu nại</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "completed" && renderCompletedOrders()}
        {activeTab === "deposits" && renderDepositOrders()}
        {activeTab === "complaints" && renderComplaints()}
      </div>
    </div>
  );
};

export default TransactionManagement;
