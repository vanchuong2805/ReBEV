import React, { useEffect, useState } from "react";
import { getOrders } from "../service";
import ReturnOrdertable from "../components/TransactionComponents/ReturnOrdertable";
import FilterBar from "../components/FilterBar";
import { ArrowUpDown } from "lucide-react";
import Pagination from "../components/ListingComponents/Pagination";

export default function ReturnOrder() {
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    order_status: "",
    priority: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 1,
    currentPage: 1,
  });
  const searchKey = `&order_id=${filSearch.searchTerm}&order_status=${filSearch.order_status}&priority=${filSearch.priority}&page=${filSearch.page}&limit=5`;
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrders(3, searchKey);
      setAllOrders(data.orders);
      setPagination({
        ...pagination,
        total: data.pagination.total,
      });
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
              { value: "PENDING", label: "Chờ xử lí" },
              { value: "RETURNING", label: "Đang vận chuyển" },
              { value: "RETURNED", label: "Đã hoàn trả" },
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
      <Pagination
        length={Number(pagination.total) / 5}
        current={filSearch.page}
        canPrev={filSearch.page > 1}
        canNext={allOrders.length === 5} // nếu đủ limit => còn trang sau
        onChange={(p) => setFilSearch((pre) => ({ ...pre, page: p }))}
      />
    </div>
  );
}
