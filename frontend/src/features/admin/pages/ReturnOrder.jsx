import React, { useEffect, useState } from "react";
import { getOrders } from "../service";
import ReturnOrdertable from "../components/TransactionComponents/ReturnOrdertable";
import FilterBar from "../components/FilterBar";
import { ArrowUpDown } from "lucide-react";
import SortSelector from "../components/SortSelector";

export default function ReturnOrder() {
  const [returnOrders, setReturnOrders] = useState([]);
  useEffect(() => {
    const fetchReturnOrders = async () => {
      const response = await getOrders(3);
      console.log(response);
      setReturnOrders(response.orders);
    };
    fetchReturnOrders();
  }, []);
  console.log(returnOrders);
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
        </div>
      </div>
      {/* Orders List */}
      <ReturnOrdertable
        returnOrders={returnOrders}
        setReturnOrders={setReturnOrders}
      />
    </div>
  );
}
