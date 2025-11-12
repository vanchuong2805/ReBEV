import React from "react";
import { updateOrderStatus } from "../../service";

export default function ReturnOrdertable({ returnOrders, setReturnOrders }) {
  console.log(returnOrders);
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

  const getBadgeStatus = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center uppercase tracking-wide";

    const style = STATUS_STYLES[status] || "bg-gray-400 text-white";
    const label = status || "UNKNOWN";

    return <span className={`${base} ${style}`}>{label}</span>;
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
                  "Thao Tác",
                ].map((text) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returnOrders.map((item) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.order_statuses[0].status.toUpperCase() ===
                    "RETURNING" ? (
                      <button
                        onClick={() => {
                          updateOrderStatus(item.id, "RETURNED");
                          setReturnOrders((prev) =>
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
                        RETURNED
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
