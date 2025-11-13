import React, { useEffect, useState } from "react";
import OrderTable from "../components/TransactionComponents/OrderTable";
import SortSelector from "../components/SortSelector";
import { ArrowUpDown } from "lucide-react";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import SearchInput from "../components/SearchInput";
import { getOrders } from "../service";
import FilterBar from "../components/FilterBar";

export default function PurchaseOrder() {
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    order_status: "",
    priority: "",
  });
  const searchKey = `&order_id=${filSearch.searchTerm}&order_status=${filSearch.order_status}&priority=${filSearch.priority}`;
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrders(1, searchKey);
      setAllOrders(data.orders);
    };
    fetchData();
  }, [filSearch]);
  console.log(filSearch);

  return (
    <div className="space-y-4">
      {/* Search */}

      <FilterBar
        setFilSearch={setFilSearch}
        filSearch={filSearch}
        searchPlaceholder="Tìm kiếm id đơn mua ..."
        selects={[
          {
            key: "status",
            value: filSearch.order_status,
            onChange: (v) =>
              setFilSearch((pre) => ({ ...pre, order_status: v })),
            options: [
              { value: "", label: "Tất cả trạng thái" },
              { value: "PENDING", label: "PENDING" },
              { value: "PAID", label: "PAID" },
              { value: "CONFIRMED", label: "CONFIRMED" },
              { value: "DELIVERING", label: "DELIVERING" },
              { value: "DELIVERED", label: "DELIVERED" },
              { value: "COMPLETED", label: "COMPLETED" },
              { value: "CANCELLED", label: "CANCELLED" },
            ],
          },
          {
            key: "priority",
            value: filSearch.priority,
            onChange: (v) => setFilSearch((pre) => ({ ...pre, priority: v })),
            options: [
              { value: "", label: "Chọn Ưu tiên" },
              { value: "PENDING", label: "PENDING" },
              { value: "PAID", label: "PAID" },
              { value: "CONFIRMED", label: "CONFIRMED" },
              { value: "DELIVERING", label: "DELIVERING" },
              { value: "DELIVERED", label: "DELIVERED" },
              { value: "COMPLETED", label: "COMPLETED" },
              { value: "CANCELLED", label: "CANCELLED" },
            ],
          },
        ]}
      />

      {/* Orders List */}
      <OrderTable allOrders={allOrders} setAllOrders={setAllOrders} />
    </div>
  );
}
