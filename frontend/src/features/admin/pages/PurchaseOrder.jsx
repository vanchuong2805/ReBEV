import React, { useEffect, useState } from "react";
import OrderTable from "../components/TransactionComponents/OrderTable";
import SortSelector from "../components/SortSelector";
import { ArrowUpDown } from "lucide-react";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import SearchInput from "../components/SearchInput";
import { getOrders } from "../service";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/ListingComponents/Pagination";

export default function PurchaseOrder() {
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
      const data = await getOrders(1, searchKey);
      console.log(searchKey);
      console.log("data", data);
      setAllOrders(data.orders);
      setPagination({
        ...pagination,
        total: data.pagination.total,
      });
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
              { value: "PENDING", label: "Đang chờ" },
              { value: "PAID", label: "Đã bán" },
              { value: "CONFIRMED", label: "Đã xác nhận" },
              { value: "DELIVERING", label: "Đang giao" },
              { value: "DELIVERED", label: "Đã giao" },
              { value: "COMPLETED", label: "Đã hoàn thành" },
              { value: "CANCELLED", label: "Đã hủy" },
            ],
          },
          {
            key: "priority",
            value: filSearch.priority,
            onChange: (v) => setFilSearch((pre) => ({ ...pre, priority: v })),
            options: [
              { value: "", label: "Chọn Ưu tiên" },
              { value: "PENDING", label: "Đang chờ" },
              { value: "PAID", label: "Đã bán" },
              { value: "CONFIRMED", label: "Đã xác nhận" },
              { value: "DELIVERING", label: "Đang giao" },
              { value: "DELIVERED", label: "Đã giao" },
              { value: "COMPLETED", label: "Đã hoàn thành" },
              { value: "CANCELLED", label: "Đã hủy" },
              { value: "FAIL_PAY", label: "Thanh toán thất bại" },
            ],
          },
        ]}
      />

      {/* Orders List */}
      <OrderTable allOrders={allOrders} setAllOrders={setAllOrders} />

      {/* Phan Trang */}
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
