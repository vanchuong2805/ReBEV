import React, { useState } from "react";
import OrderTableDetail from "./OrderTableDetail";

export default function OrderTable({ allOrders }) {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const STATUS_STYLES = {
    DELIVERING: "bg-amber-500 text-white",
    PAID: "bg-emerald-600 text-white",
    CONFIRMED: "bg-indigo-600 text-white",
    DELIVERED: "bg-cyan-600 text-white",
    CANCELLED: "bg-rose-600 text-white",
    FAIL_PAY: "bg-rose-600 text-white",
    PENDING: "bg-yellow-500 text-white",
    COMPLETED: "bg-blue-600 text-white",
  };
  const translateStatus = (status) => {
    switch (status) {
      case "DELIVERING":
        return "Đang giao";
      case "PENDING":
        return "Đang chờ";
      case "PAID":
        return "Đã bán";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "DELIVERED":
        return "Đã giao";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "FAIL_PAY":
        return `Thanh toán thất bại`;
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

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };
  return (
    // lưu ý: loại bỏ overflow-hidden tại đây để không cắt thanh scroll
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* wrapper cho phép scroll ngang */}
        <div className="overflow-x-auto">
          {/* min-w đảm bảo bảng có đủ chiều rộng; table-fixed giúp chia cột theo width */}
          <table className="min-w-[1100px] w-full table-fixed divide-y divide-gray-200">
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
                  // đặt width cụ thể cho cột Thao Tác
                  <th
                    key={text}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      text === "Thao Tác" ? "w-36" : ""
                    }`}
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allOrders.map((item) => {
                const status =
                  item.order_statuses?.[0]?.status?.toUpperCase() || "";
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleOpenDetail(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-24">
                      {item.customer.display_name}
                    </td>
                    <td className="px-3 py-2 break-words text-sm text-gray-900">
                      {item.seller.display_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_amount.toLocaleString("vi-VN") + " VND"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBadgeStatus(status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.order_statuses?.[0]?.create_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.order_statuses?.[0]?.create_by_user?.display_name ||
                        "N/A"}
                    </td>

                    {/* cột thao tác: dùng whitespace-nowrap để không xuống dòng */}
                  </tr>
                );
              })}
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
