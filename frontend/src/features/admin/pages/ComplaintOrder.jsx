import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import { ArrowUpDown } from "lucide-react";
import SortSelector from "../components/SortSelector";
import ComplaintsTable from "../components/TransactionComponents/ComplaintsTable";
import { Outlet } from "react-router";

export default function ComplaintOrder() {
  const orderSortOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "seller_cancelled", label: "Bên bán hủy" },
    { value: "buyer_cancelled", label: "Bên mua hủy" },
    { value: "completed", label: "Giao dịch thành công" },
  ];
  const [orderSortOption, setOrderSortOption] = useState("status"); // Default sort by status

  return (
    <>
      <div className="space-y-4">
        {/* Filter */}

        <FilterBar
          selects={[
            {
              key: "status",
              value: "",
              options: [
                { value: "", label: "Tất cả trạng thái" },
                { value: 0, label: "Chờ duyệt" },
                { value: 1, label: "Đã duyệt" },
                { value: 2, label: "Từ chối" },
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
        <ComplaintsTable />
      </div>
    </>
  );
}
