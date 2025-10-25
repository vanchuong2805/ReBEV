import React from "react";

export default function ComplaintsTable({
  complaints = [],
  renderStatusBadge, // (status) => ReactNode
  onProcess, // (complaint) => void
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
                "Mã khiếu nại",
                "Tên khách hàng",
                "Lý do",
                "Ngày tạo",
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
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {c.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.createdDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge ? renderStatusBadge(c.status) : c.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.status === "pending" && (
                    <button
                      onClick={() => onProcess?.(c)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Xử lý
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {complaints.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-sm text-gray-500 text-center"
                >
                  Không có khiếu nại nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
