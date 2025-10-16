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
  ArrowUpDown,
} from "lucide-react";
import TitlePage from "../components/TitlePage";
import FilterTransaction from "../components/FilterTransaction";
import OrderTable from "../components/OrderTable";
import DepositOrdersTable from "../components/DepositOrdersTable";
import DepositDetailModal from "../components/DepositDetailModal";
import ComplaintsTable from "../components/ComplaintsTable";
import ComplaintSummaryModal from "../components/ComplaintSummaryModal";
import ComplaintDetailModal from "../components/ComplaintDetailModal";
import SearchInput from "../components/SearchInput";
import SortSelector from "../components/SortSelector";

const TransactionManagement = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filter states
  const [completedFilter, setCompletedFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [depositFilter, setDepositFilter] = useState("all");
  const [complaintFilter, setComplaintFilter] = useState("all");

  // Sort state
  const [orderSortOption, setOrderSortOption] = useState("status"); // Default sort by status

  // Mock data
  const [allOrders, setAllOrders] = useState([
    {
      id: "ORD-001",
      productName: "Xe máy điện VinFast Klara S",
      category: "xe-may-dien",
      buyerName: "Nguyễn Văn A",
      sellerName: "Trần Thị B",
      amount: 45000000,
      completedDate: "2024-10-10",
      orderId: "ORDER-001",
      status: "completed",
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
      status: "completed",
    },
    {
      id: "ORD-003",
      productName: "Xe máy điện Yadea",
      category: "xe-may-dien",
      buyerName: "Hoàng Văn K",
      sellerName: "Lý Thị L",
      amount: 32000000,
      completedDate: "",
      orderId: "ORDER-003",
      status: "pending",
    },
    {
      id: "ORD-004",
      productName: "Pin xe máy điện 72V",
      category: "pin-xe-may-dien",
      buyerName: "Đỗ Thị M",
      sellerName: "Bùi Văn N",
      amount: 9200000,
      completedDate: "",
      orderId: "ORDER-004",
      status: "cancelled",
    },
    {
      id: "ORD-005",
      productName: "Xe máy điện VinFast Feliz S",
      category: "xe-may-dien",
      buyerName: "Trương Văn P",
      sellerName: "Mai Thị Q",
      amount: 39000000,
      completedDate: "2024-10-15", // Newest completed order
      orderId: "ORDER-005",
      status: "completed",
    },
    {
      id: "ORD-006",
      productName: "Pin xe máy điện Lithium 48V",
      category: "pin-xe-may-dien",
      buyerName: "Ngô Văn R",
      sellerName: "Đinh Thị S",
      amount: 6800000,
      completedDate: "",
      orderId: "ORDER-006",
      status: "pending",
    },
    {
      id: "ORD-007",
      productName: "Xe máy điện Pega",
      category: "xe-may-dien",
      buyerName: "Lương Văn T",
      sellerName: "Hà Thị U",
      amount: 28000000,
      completedDate: "",
      orderId: "ORDER-007",
      status: "buyer_cancelled",
    },
    {
      id: "ORD-008",
      productName: "Pin xe máy điện Bosch",
      category: "pin-xe-may-dien",
      buyerName: "Đặng Văn V",
      sellerName: "Trịnh Thị X",
      amount: 9500000,
      completedDate: "2024-09-25", // Oldest completed order
      orderId: "ORDER-008",
      status: "completed",
    },
    {
      id: "ORD-009",
      productName: "Xe máy điện Dibao",
      category: "xe-may-dien",
      buyerName: "Tô Văn Y",
      sellerName: "Huỳnh Thị Z",
      amount: 22000000,
      completedDate: "",
      orderId: "ORDER-009",
      status: "seller_cancelled",
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
    { id: "orders", label: "Đơn hàng", icon: CheckCircle },
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

  const orderStatusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
    { value: "buyer_cancelled", label: "Bên mua hủy" },
    { value: "seller_cancelled", label: "Bên bán hủy" },
  ];

  const orderSortOptions = [
    { value: "status", label: "Trạng thái (mặc định)" },
    { value: "date", label: "Ngày hoàn thành" },
    { value: "price", label: "Giá tiền" },
    { value: "buyer", label: "Tên người mua" },
    { value: "orderId", label: "Mã đơn hàng" },
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
              status: "completed",
            };
            setAllOrders((prev) => [...prev, newCompletedOrder]);
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
  };

  // Sort orders by selected sort option
  const sortOrders = (orders, sortOption) => {
    return [...orders].sort((a, b) => {
      switch (sortOption) {
        case "status": {
          // Priority order: pending -> newest completed -> oldest completed -> cancelled
          const statusPriority = {
            pending: 1,
            completed: 2,
            cancelled: 3,
            buyer_cancelled: 3,
            seller_cancelled: 3,
          };

          // First sort by status priority
          if (statusPriority[a.status] !== statusPriority[b.status]) {
            return statusPriority[a.status] - statusPriority[b.status];
          }

          // If same status and both are completed, sort by completion date (newest first)
          if (a.status === "completed" && b.status === "completed") {
            const dateA = a.completedDate
              ? new Date(a.completedDate)
              : new Date(0);
            const dateB = b.completedDate
              ? new Date(b.completedDate)
              : new Date(0);
            return dateB - dateA; // Newest first
          }
          return 0;
        }

        case "date": {
          // Sort by completion date (newest first)
          const dateA = a.completedDate
            ? new Date(a.completedDate)
            : new Date(0);
          const dateB = b.completedDate
            ? new Date(b.completedDate)
            : new Date(0);
          return dateB - dateA;
        }

        case "price": {
          // Sort by amount (highest first)
          return b.amount - a.amount;
        }

        case "buyer": {
          // Sort by buyer name (alphabetically)
          return a.buyerName.localeCompare(b.buyerName);
        }

        case "orderId": {
          // Sort by order ID (alphabetically)
          return a.orderId.localeCompare(b.orderId);
        }

        default:
          return 0;
      }
    });
  };

  const filteredAllOrders = sortOrders(
    allOrders.filter(
      (order) =>
        (completedFilter === "all" || order.category === completedFilter) &&
        (orderStatusFilter === "all" || order.status === orderStatusFilter) &&
        (orderSearchQuery === "" ||
          order.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()))
    ),
    orderSortOption
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
      cancelled: {
        color: "bg-red-100 text-red-800",
        text: "Đã hủy",
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

  const renderAllOrders = () => {
    const orderColumns = [
      { header: "Mã đơn hàng", accessor: "orderId" },
      { header: "Sản phẩm", accessor: "productName" },
      { header: "Người mua", accessor: "buyerName" },
      { header: "Người bán", accessor: "sellerName" },
      {
        header: "Số tiền",
        render: (order) => `${order.amount.toLocaleString("vi-VN")} VND`,
      },
      {
        header: "Ngày hoàn thành",
        render: (order) => order.completedDate || "—",
      },
      {
        header: "Trạng thái",
        render: (order) => getStatusBadge(order.status),
      },
    ];

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="w-full max-w-md mb-2">
          <SearchInput
            value={orderSearchQuery}
            onChange={setOrderSearchQuery}
            placeholder="Tìm kiếm theo mã đơn hàng..."
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <FilterTransaction
              id="completed-filter"
              label="Lọc theo danh mục:"
              value={completedFilter}
              onChange={setCompletedFilter}
              options={categoryOptions}
            />

            {/* Status Filter */}
            <FilterTransaction
              id="order-status-filter"
              label="Lọc theo trạng thái:"
              value={orderStatusFilter}
              onChange={setOrderStatusFilter}
              options={orderStatusOptions}
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center">
            <ArrowUpDown size={16} className="mr-2 text-gray-500" />
            <SortSelector
              value={orderSortOption}
              onChange={setOrderSortOption}
              options={orderSortOptions}
            />
          </div>
        </div>

        {/* Orders List */}
        <OrderTable columns={orderColumns} data={filteredAllOrders} />
      </div>
    );
  };

  const renderDepositOrders = () => (
    <div className="space-y-4">
      {/* Filter */}
      <FilterTransaction
        id="deposit-filter"
        label="Lọc theo trạng thái:"
        value={depositFilter}
        onChange={setDepositFilter}
        options={depositStatusOptions}
      />

      {/* Orders List */}
      <DepositOrdersTable
        orders={filteredDepositOrders}
        onProcess={(order) => {
          // Trực tiếp xử lý trạng thái mà không cần hiển thị modal
          if (order.actionType) {
            handleDepositStatusChange(order.id, order.actionType);
          } else {
            setSelectedDeposit(order);
          }
        }}
        renderStatusBadge={(status) => getStatusBadge(status)}
      />

      {/* Deposit Detail Modal - chỉ hiển thị khi không có actionType */}
      {selectedDeposit && !selectedDeposit.actionType && (
        <DepositDetailModal
          deposit={selectedDeposit}
          onClose={() => setSelectedDeposit(null)}
          onChangeStatus={(id, status) => handleDepositStatusChange(id, status)}
        />
      )}
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-4">
      {/* Filter */}
      <FilterTransaction
        id="complaint-filter"
        label="Lọc theo trạng thái:"
        value={complaintFilter}
        onChange={setComplaintFilter}
        options={complaintStatusOptions}
      />

      {/* Complaints List */}
      <ComplaintsTable
        complaints={filteredComplaints}
        renderStatusBadge={(status) => getStatusBadge(status)}
        onProcess={(c) => {
          setSelectedComplaint(c); // Chỉ cần set selectedComplaint, modal sẽ hiện
        }}
      />

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => {
            setSelectedComplaint(null);
          }}
          onChangeStatus={(id, status, desc) =>
            handleComplaintStatusChange(id, status, desc)
          }
          onChangeDescription={(newDesc) =>
            setSelectedComplaint((prev) => ({ ...prev, description: newDesc }))
          }
        />
      )}
    </div>
  );

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý giao dịch"
        description="Quản lý đơn hàng, đặt cọc và khiếu nại"
      />
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
        {activeTab === "orders" && renderAllOrders()}
        {activeTab === "deposits" && renderDepositOrders()}
        {activeTab === "complaints" && renderComplaints()}
      </div>
    </div>
  );
};

export default TransactionManagement;
