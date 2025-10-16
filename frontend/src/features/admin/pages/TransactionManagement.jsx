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
import TitlePage from "../components/TitlePage";
import FilterTransaction from "../components/FilterTransaction";
import OrderTable from "../components/OrderTable";
import DepositOrdersTable from "../components/DepositOrdersTable";
import DepositDetailModal from "../components/DepositDetailModal";
import ComplaintsTable from "../components/ComplaintsTable";
import ComplaintSummaryModal from "../components/ComplaintSummaryModal";
import ComplaintDetailModal from "../components/ComplaintDetailModal";

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
    { id: "completed", label: "Đơn hàng", icon: CheckCircle },
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

  const renderCompletedOrders = () => {
    const completedColumns = [
      { header: "Mã đơn hàng", accessor: "orderId" },
      { header: "Sản phẩm", accessor: "productName" },
      { header: "Người mua", accessor: "buyerName" },
      { header: "Người bán", accessor: "sellerName" },
      {
        header: "Số tiền",
        render: (order) => `${order.amount.toLocaleString("vi-VN")} VND`,
      },
      { header: "Ngày hoàn thành", accessor: "completedDate" },
    ];
    return (
      <div className="space-y-4">
        {/* Filter */}
        <FilterTransaction
          id="completed-filter"
          label="Lọc theo danh mục:"
          value={completedFilter}
          onChange={setCompletedFilter}
          options={categoryOptions}
        />

        {/* Orders List */}
        <OrderTable columns={completedColumns} data={filteredCompletedOrders} />
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
        onProcess={(order) => setSelectedDeposit(order)}
        renderStatusBadge={(status) => getStatusBadge(status)}
      />

      {/* Deposit Detail Modal */}
      {selectedDeposit && (
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
          setSelectedComplaint(c);
          setShowComplaintDetail(false); // mở modal tóm tắt trước
        }}
      />

      {/* Complaint Summary Modal */}
      {selectedComplaint && !showComplaintDetail && (
        <ComplaintSummaryModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onViewDetail={() => setShowComplaintDetail(true)}
        />
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && showComplaintDetail && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => {
            setShowComplaintDetail(false);
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
        {activeTab === "completed" && renderCompletedOrders()}
        {activeTab === "deposits" && renderDepositOrders()}
        {activeTab === "complaints" && renderComplaints()}
      </div>
    </div>
  );
};

export default TransactionManagement;
