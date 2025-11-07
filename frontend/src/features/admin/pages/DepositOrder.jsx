import React, { useState } from "react";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import DepositOrdersTable from "../components/TransactionComponents/DepositOrdersTable";
import DepositDetailModal from "../components/TransactionComponents/DepositDetailModal";

export default function DepositOrder() {
  const [depositFilter, setDepositFilter] = useState("all");
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  const depositStatusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "seller_cancelled", label: "Bên bán hủy" },
    { value: "buyer_cancelled", label: "Bên mua hủy" },
    { value: "completed", label: "Giao dịch thành công" },
  ];
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
  const filteredDepositOrders = depositOrders.filter(
    (order) => depositFilter === "all" || order.status === depositFilter
  );
  const handleDepositStatusChange = (depositId, newStatus) => {
    console.log(depositId + newStatus);
  };
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

  return (
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
      <DepositOrdersTable orders={filteredDepositOrders} />

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
}
