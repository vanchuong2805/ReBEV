import React from "react"

const STATUS_MAP = {
  PENDING: "Chờ xác nhận",
  PAID: "Đã thanh toán",
  CONFIRMED: "Đang xử lý",
  DELIVERING: "Đang vận chuyển",
  DELIVERED: "Đã giao hàng",
  COMPLETED: "Đã giao thành công",
  RETURNING: "Đang hoàn trả",
  RETURNED: "Đã hoàn tiền",
  CANCELLED: "Đã hủy",
  CUSTOMER_CANCELLED: "Đã hủy (người mua)",
  SELLER_CANCELLED: "Đã hủy (người bán)",
  FAIL_PAY: "Thanh toán thất bại",
}

export default function OrderTimeline({ timeline = [], isCanceled = false }) {
  if (!timeline.length) {
    return <p className="text-gray-500 italic">Chưa có lịch sử trạng thái</p>
  }

  return (
    <div>
      {/* === Trạng thái mới nhất === */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${
            isCanceled ? "bg-red-500" : "bg-[#007BFF]"
          }`}
        />
        <div>
          <p
            className={`text-sm font-medium ${
              isCanceled ? "text-red-600" : "text-[#007BFF]"
            }`}
          >
            {STATUS_MAP[timeline[0]?.status] || "Đang cập nhật"}
          </p>
          <p className="text-xs text-gray-500">
            {timeline[0]?.create_at
              ? new Date(timeline[0].create_at).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>

      {/* === Các mốc trạng thái cũ === */}
      <div className="space-y-4 relative pl-4 border-l-2 border-gray-200">
        {timeline.slice(1).map((item, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-gray-300" />
            <div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-600 flex-shrink-0">
                  {new Date(item.create_at).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-900 flex-1">
                  {STATUS_MAP[item.status] || "Đang cập nhật"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {timeline.length > 3 && (
        <button className="text-sm text-[#007BFF] hover:underline mt-2 ml-4">
          Xem thêm
        </button>
      )}
    </div>
  )
}
