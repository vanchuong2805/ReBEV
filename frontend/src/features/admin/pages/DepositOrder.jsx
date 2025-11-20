import React, { useEffect, useState } from "react";
import DepositOrdersTable from "../components/TransactionComponents/DepositOrdersTable";
import FilterBar from "../components/FilterBar";
import { getOrders } from "../service";
import Pagination from "../components/ListingComponents/Pagination";

export default function DepositOrder() {
  const [orders, setOrders] = useState([]);
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
  useEffect(() => {
    (async () => {
      const data = await getOrders(2, searchKey);
      setOrders(data.orders || []);
      setPagination({
        ...pagination,
        total: data.pagination.total,
      });
    })();
  }, [filSearch]);
  return (
    <div className="space-y-4">
      {/* Filter */}

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
              { value: "PENDING", label: "Chờ duyệt" },
              { value: "PAID", label: "Đã bán" },
              { value: "CUSTOMER_CANCELLED", label: "Người mua hủy" },
              { value: "SELLER_CANCELLED", label: "Người bán hủy" },
              { value: "CANCELLED", label: "Đã hủy" },
              { value: "COMPLETED", label: "Hoàn thành" },
              { value: "FAIL_PAY", label: "Thanh toán thất bại" },
            ],
          },
        ]}
      />
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-4">{/* Category Filter */}</div>
      </div>
      {/* Orders List */}
      <DepositOrdersTable orders={orders} setOrders={setOrders} />
      <Pagination
        length={Number(pagination.total) / 5}
        current={filSearch.page}
        canPrev={filSearch.page > 1}
        canNext={orders.length === 5} // nếu đủ limit => còn trang sau
        onChange={(p) => setFilSearch((pre) => ({ ...pre, page: p }))}
      />
    </div>
  );
}
