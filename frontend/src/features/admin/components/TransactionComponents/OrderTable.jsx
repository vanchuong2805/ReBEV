import React from "react";
import { updateOrderStatus } from "../../service";

export default function OrderTable({ allOrders, setAllOrders }) {
  // utils/getStatusBadge.js
  const getBadgeStatus = (status) => {
    const base =
      "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center justify-center";

    switch (status) {
      case "DELIVERING":
        return (
          <span
            className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-300`}
          >
            'DELIVERING'
          </span>
        );

      case "PAID":
        return (
          <span
            className={`${base} bg-green-100 text-green-800 border border-green-300`}
          >
            'PAID'
          </span>
        );

      case "CONFIRMED":
        return (
          <span
            className={`${base} bg-red-100 text-red-800 border border-red-300`}
          >
            'CONFIRMED'
          </span>
        );
      case "DELIVERED":
        return (
          <span
            className={`${base} bg-red-100 text-red-800 border border-red-300`}
          >
            'DELIVERED'
          </span>
        );
      case "CANCELLED":
        return (
          <span
            className={`${base} bg-red-100 text-red-800 border border-red-300`}
          >
            'CANCELLED'
          </span>
        );
      case "FAIL_PAY":
        return (
          <span
            className={`${base} bg-red-100 text-red-800 border border-red-300`}
          >
            'FAIL_PAY'
          </span>
        );
      case "COMPLETED":
        return (
          <span
            className={`${base} bg-red-100 text-red-800 border border-red-300`}
          >
            COMPLETED
          </span>
        );

      default:
        return (
          <span
            className={`${base} bg-gray-100 text-gray-700 border border-gray-300`}
          >
            Không xác định
          </span>
        );
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Đơn Mua
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người Mua
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người Bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng Tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Chỉnh Sửa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người Chỉnh Sửa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao Tác{" "}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allOrders.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
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
                  {getBadgeStatus(item.order_statuses[0].status.toUpperCase())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.order_statuses[0].create_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.order_statuses[0].create_by_user?.display_name
                    ? item.order_statuses[0].create_by_user?.display_name
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.order_statuses[0].status.toUpperCase() ===
                  "DELIVERING" ? (
                    <button
                      onClick={() => {
                        updateOrderStatus(item.id, "DELIVERED");
                        setAllOrders((prev) =>
                          prev.map((order) =>
                            order.id === item.id
                              ? {
                                  ...order,
                                  order_statuses: [
                                    {
                                      ...(order.order_statuses?.[0] || {}),
                                      status, // cập nhật đúng chỗ UI đang đọc
                                      create_at: new Date().toISOString(),
                                    },
                                    ...(order.order_statuses?.slice(1) || []),
                                  ],
                                }
                              : order
                          )
                        );
                      }}
                      className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white transition"
                    >
                      DELIVERED
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
