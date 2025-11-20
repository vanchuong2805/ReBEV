import React, { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";

import ComplaintsTable from "../components/TransactionComponents/ComplaintsTable";
import { getComplaints } from "../service";
import Pagination from "../components/ListingComponents/Pagination";

export default function ComplaintOrder() {
  const [orders, setOrders] = useState([]);
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    complaint_status: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 1,
    currentPage: 1,
  });
  let searchKey = "?page=" + filSearch.page + "&limit=5";
  if (filSearch.searchTerm !== "") {
    searchKey += `&id=${filSearch.searchTerm}`;
  }
  if (filSearch.complaint_status !== "") {
    searchKey += `&status=${filSearch.complaint_status}`;
  }
  useEffect(() => {
    (async () => {
      const data = await getComplaints(searchKey);
      console.log("data", data);
      setOrders(data.complaints || []);
      setPagination({
        ...pagination,
        total: data.pagination.total,
      });
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
                setFilSearch((pre) => ({ ...pre, complaint_status: v })),
              options: [
                { value: "", label: "Tất cả trạng thái" },
                { value: "0", label: "Đang xử lí" },
                { value: "1", label: "Chấp nhận" },
                { value: "2", label: "Từ chối" },
                { value: "3", label: "Hủy" },
              ],
            },
          ]}
        />
        {/* Orders List */}
        <ComplaintsTable complaints={orders} setComplaints={setOrders} />
        <Pagination
          length={Number(pagination.total) / 5}
          current={filSearch.page}
          canPrev={filSearch.page > 1}
          canNext={orders.length === 5} // nếu đủ limit => còn trang sau
          onChange={(p) => setFilSearch((pre) => ({ ...pre, page: p }))}
        />
      </div>
    </>
  );
}
