import React, { useEffect, useState } from "react";
import { getOrders } from "../service";
import ReturnOrdertable from "../components/TransactionComponents/ReturnOrdertable";
import FilterBar from "../components/FilterBar";
import { ArrowUpDown } from "lucide-react";
import SortSelector from "../components/SortSelector";

export default function ReturnOrder() {
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    order_status: "",
    priority: "",
  });
  const searchKey = `&order_id=${filSearch.searchTerm}&order_status=${filSearch.order_status}&priority=${filSearch.priority}`;
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrders(3, searchKey);
      setAllOrders(data.orders);
    };
    fetchData();
  }, [filSearch]);
  console.log(allOrders);
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
              { value: "RETURNING", label: "RETURNING" },
              { value: "RETURNED", label: "RETURNED" },
            ],
          },
        ]}
      />
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-4">{/* Category Filter */}</div>
        {/* Sort Selector */}
        <div className="flex items-center">
          <ArrowUpDown size={16} className="mr-2 text-gray-500" />
        </div>
      </div>
      {/* Orders List */}
      <ReturnOrdertable
        returnOrders={allOrders}
        setReturnOrders={setAllOrders}
      />
    </div>
  );
}
