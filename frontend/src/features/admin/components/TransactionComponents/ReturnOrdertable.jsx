import React, { useState } from "react";
import OrderTableDetail from "./OrderTableDetail";

export default function ReturnOrdertable({ returnOrders }) {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };
  console.log(returnOrders);
  const STATUS_STYLES = {
    RETURNED: "bg-emerald-600 text-white",
    RETURNING: "bg-indigo-600 text-white",
    DELIVERED: "bg-cyan-600 text-white",
    CANCELLED: "bg-rose-600 text-white",
    FAIL_PAY: "bg-rose-600 text-white",
    PENDING: "bg-yellow-500 text-white",
    COMPLETED: "bg-blue-600 text-white",
  };
  const translateStatus = (status) => {
    switch (status) {
      case "RETURNING":
        return "Đang vận chuyển";
      case "RETURNED":
        return "Đã hoàn trả";
      case "PENDING":
        return "Chờ xử lí";
      default:
        return status;
    }
  };
  const getBadgeStatus = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center uppercase tracking-wide";

    const style = STATUS_STYLES[status] || "bg-gray-400 text-white";
    const label = status || "UNKNOWN";

    return <span className={`${base} ${style}`}>{translateStatus(label)}</span>;
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Cho phép cuộn ngang khi thiếu chỗ */}
        <div className="overflow-x-auto">
          {/* Ép có độ rộng tối thiểu để không bị bóp cột + table-fixed */}
          <table className="min-w-[1100px] w-full table-fixed divide-y divide-gray-200">
            {/* width tương đối cho từng cột */}

            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID Đơn Mua",
                  "Người Mua",
                  "Người Bán",
                  "Tổng Tiền",
                  "Trạng Thái",
                  "Ngày Chỉnh Sửa",
                  "Người Chỉnh Sửa",
                ].map((text) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returnOrders.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                  onClick={() => handleOpenDetail(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.customer.display_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.seller.display_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.total_amount.toLocaleString("vi-VN") + " VND"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getBadgeStatus(
                      item.order_statuses[0].status.toUpperCase()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.order_statuses[0].create_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.order_statuses[0].create_by_user?.display_name
                      ? item.order_statuses[0].create_by_user?.display_name
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OrderTableDetail
        openDetail={openDetail}
        orderId={selectedOrder?.id}
        onClose={handleCloseDetail}
      />
    </>
  );
}
