import React, { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import { ArrowUpDown } from "lucide-react";
import SortSelector from "../components/SortSelector";
import ComplaintsTable from "../components/TransactionComponents/ComplaintsTable";
import { Outlet } from "react-router";
import { getComplaints } from "../service";

export default function ComplaintOrder() {
  const orderSortOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "seller_cancelled", label: "Bên bán hủy" },
    { value: "buyer_cancelled", label: "Bên mua hủy" },
    { value: "completed", label: "Giao dịch thành công" },
  ];
  const [orderSortOption, setOrderSortOption] = useState("status"); // Default sort by status
  const [orders, setOrders] = useState([]);
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    complaint_status: "",
    priority: "",
  });
  const searchKey = `?id=${filSearch.searchTerm}&complaint_status=${filSearch.complaint_status}&priority=${filSearch.priority}`;
  useEffect(() => {
    (async () => {
      const data = await getComplaints(searchKey);
      setOrders(data.complaints || []);
    })();
  }, [filSearch]);
  return (
    <>
      <div className="space-y-4">
        {/* Filter */}

        <FilterBar
          setFilSearch={setFilSearch}
          filSearch={filSearch}
          searchPlaceholder="Tìm kiếm id ..."
          selects={[
            {
              key: "status",
              value: filSearch.order_status,
              onChange: (v) =>
                setFilSearch((pre) => ({ ...pre, order_status: v })),
              options: [
                { value: "", label: "Tất cả trạng thái" },
                { value: "PENDING", label: "Chờ duyệt" },
                { value: "PAID", label: "PAID" },
                { value: "CUSTOMER_CANCELLED", label: "CUSTOMER_CANCELLED" },
                { value: "SELLER_CANCELLED", label: "SELLER_CANCELLED" },
                { value: "CANCELLED", label: "CANCELLED" },
                { value: "COMPLETED", label: "COMPLETED" },
              ],
            },
          ]}
        />
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4">{/* Category Filter */}</div>
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
        <ComplaintsTable complaints={orders} setComplaints={setOrders} />
      </div>
    </>
  );
}
