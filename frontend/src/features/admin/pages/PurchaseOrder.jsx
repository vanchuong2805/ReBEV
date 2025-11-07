import React, { useEffect, useState } from "react";
import OrderTable from "../components/TransactionComponents/OrderTable";
import SortSelector from "../components/SortSelector";
import { ArrowUpDown } from "lucide-react";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import SearchInput from "../components/SearchInput";
import { getOrders } from "../service";

export default function PurchaseOrder() {
  const [completedFilter, setCompletedFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSortOption, setOrderSortOption] = useState("status"); // Default sort by status
  const [allOrders, setAllOrders] = useState([]);
  const categoryOptions = [
    { value: "all", label: "Tất cả" },
    { value: "xe-may-dien", label: "Xe máy điện" },
    { value: "pin-xe-may-dien", label: "Pin xe máy điện" },
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

  //   const sortOrders = (orders, sortOption) => {
  //     return [...orders].sort((a, b) => {
  //       switch (sortOption) {
  //         case "status": {
  //           // Priority order: pending -> newest completed -> oldest completed -> cancelled
  //           const statusPriority = {
  //             pending: 1,
  //             completed: 2,
  //             cancelled: 3,
  //             buyer_cancelled: 3,
  //             seller_cancelled: 3,
  //           };

  //           // First sort by status priority
  //           if (statusPriority[a.status] !== statusPriority[b.status]) {
  //             return statusPriority[a.status] - statusPriority[b.status];
  //           }

  //           // If same status and both are completed, sort by completion date (newest first)
  //           if (a.status === "completed" && b.status === "completed") {
  //             const dateA = a.completedDate
  //               ? new Date(a.completedDate)
  //               : new Date(0);
  //             const dateB = b.completedDate
  //               ? new Date(b.completedDate)
  //               : new Date(0);
  //             return dateB - dateA; // Newest first
  //           }
  //           return 0;
  //         }

  //         case "date": {
  //           // Sort by completion date (newest first)
  //           const dateA = a.completedDate
  //             ? new Date(a.completedDate)
  //             : new Date(0);
  //           const dateB = b.completedDate
  //             ? new Date(b.completedDate)
  //             : new Date(0);
  //           return dateB - dateA;
  //         }

  //         case "price": {
  //           // Sort by amount (highest first)
  //           return b.amount - a.amount;
  //         }

  //         case "buyer": {
  //           // Sort by buyer name (alphabetically)
  //           return a.buyerName.localeCompare(b.buyerName);
  //         }

  //         case "orderId": {
  //           // Sort by order ID (alphabetically)
  //           return a.orderId.localeCompare(b.orderId);
  //         }

  //         default:
  //           return 0;
  //       }
  //     });
  //   };
  //   const filteredAllOrders = sortOrders(
  //     allOrders.filter(
  //       (order) =>
  //         (completedFilter === "all" || order.category === completedFilter) &&
  //         (orderStatusFilter === "all" || order.status === orderStatusFilter) &&
  //         (orderSearchQuery === "" ||
  //           order.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()))
  //     ),
  //     orderSortOption
  //   );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrders(1);
      setAllOrders(data.orders);
    };
    fetchData();
  }, []);

  console.log(allOrders);
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
      <OrderTable allOrders={allOrders} />
    </div>
  );
}
