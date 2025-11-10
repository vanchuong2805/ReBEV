import React, { useEffect, useState } from "react";
import OrderTable from "../components/TransactionComponents/OrderTable";
import SortSelector from "../components/SortSelector";
import { ArrowUpDown } from "lucide-react";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import SearchInput from "../components/SearchInput";
import { getOrders } from "../service";
import FilterBar from "../components/FilterBar";

export default function PurchaseOrder() {
  const [orderSortOption, setOrderSortOption] = useState("status"); // Default sort by status
  const [allOrders, setAllOrders] = useState([]);

  const orderSortOptions = [
    { value: "status", label: "Trạng thái (mặc định)" },
    { value: "date", label: "Ngày hoàn thành" },
  ];

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

      <FilterBar
        searchPlaceholder="Mã đơn hàng..."
        selects={[
          {
            key: "status",
            value: "",
            options: [
              { value: "", label: "Tất cả trạng thái" },
              { value: 0, label: "Chờ duyệt" },
              { value: 1, label: "Đã duyệt" },
              { value: 2, label: "Từ chối" },
              { value: 3, label: "Hoàn tất giao dịch" },
              { value: 4, label: "Đang trong quá trình hoàn tất" },
              { value: 5, label: "Đã dừng lại" },
              { value: 6, label: "Đang xác minh" },
              { value: 7, label: "Đang giao dịch" },
            ],
          },
        ]}
      ></FilterBar>
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
      <OrderTable allOrders={allOrders} setAllOrders={setAllOrders} />
    </div>
  );
}
