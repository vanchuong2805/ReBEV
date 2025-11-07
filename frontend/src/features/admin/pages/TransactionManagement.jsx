import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, ArrowUpDown, RotateCcw } from "lucide-react";
import TitlePage from "../components/TitlePage";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import OrderTable from "../components/TransactionComponents/OrderTable";
import DepositOrdersTable from "../components/TransactionComponents/DepositOrdersTable";
import DepositDetailModal from "../components/TransactionComponents/DepositDetailModal";
import ComplaintsTable from "../components/TransactionComponents/ComplaintsTable";
import ComplaintDetailModal from "../components/TransactionComponents/ComplaintDetailModal";
import SearchInput from "../components/SearchInput";
import SortSelector from "../components/SortSelector";
import { getOrders } from "../service";
import { Outlet, useNavigate } from "react-router";

const TransactionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchase-orders");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [oderss, setOrderss] = useState([]);
  useEffect(() => {
    getOrders().then((data) => {
      setOrderss(data);
    });
  }, []);
  console.log(oderss);

  // Filter states
  const [complaintFilter, setComplaintFilter] = useState("all");

  // Sort state

  // Mock data

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
    { id: "purchase-orders", label: "Đơn Mua", icon: CheckCircle },
    { id: "deposit-orders", label: "Đơn đặt cọc", icon: Clock },
    { id: "complaint-orders", label: "Đơn khiếu nại", icon: AlertTriangle },
    { id: "return-orders", label: "Trả hàng", icon: RotateCcw },
  ];

  const complaintStatusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "approved", label: "Đồng ý" },
    { value: "rejected", label: "Từ chối" },
  ];

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
                  onClick={() => {
                    setActiveTab(tab.id);
                    console.log(activeTab.id);
                    navigate(`/admin/transactions/${tab.id}`);
                  }}
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
      <Outlet />
      {/* Tab Content */}
      <div>{activeTab === "complaints" && renderComplaints()}</div>
    </div>
  );
};

export default TransactionManagement;
