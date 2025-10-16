import React from "react";

export default function DepositOrdersTable({
  orders = [],
  onProcess, // (order) => void
  renderStatusBadge, // (status) => ReactNode
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Mã đơn",
                "Sản phẩm",
                "Người mua",
                "Số tiền cọc",
                "Trạng thái",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.buyerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.depositAmount.toLocaleString("vi-VN")} VND
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge
                    ? renderStatusBadge(order.status)
                    : order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.status === "pending" && (
                    <button
                      onClick={() => onProcess?.(order)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Xử lý
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  className="px-6 py-8 text-sm text-gray-500 text-center"
                  colSpan={6}
                >
                  Không có đơn đặt cọc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
