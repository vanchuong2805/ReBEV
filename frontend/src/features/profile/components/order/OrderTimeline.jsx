import { useState } from "react"
import DeliveryMediaModal from "./DeliveryMediaModal"

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
  const [openMedia, setOpenMedia] = useState(false)
  const [mediaString, setMediaString] = useState(null)

  if (!timeline.length) {
    return <p className="text-gray-500 italic">Chưa có lịch sử trạng thái</p>
  }

  const latest = timeline[0]

  const handleOpenMedia = (mediaRaw) => {
    setMediaString(mediaRaw)     // truyền string JSON nguyên vẹn
    setOpenMedia(true)
  }

  return (
    <div>
      {/* === Trạng thái mới nhất === */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${isCanceled ? "bg-red-500" : "bg-[#007BFF]"
            }`}
        />
        <div>
          <p
            className={`text-sm font-medium ${isCanceled ? "text-red-600" : "text-[#007BFF]"
              }`}
          >
            {STATUS_MAP[latest.status] || "Đang cập nhật"}
          </p>
          <p className="text-xs text-gray-500">
            {latest.create_at
              ? new Date(latest.create_at).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              : "—"}
            <p>

              {latest.status === "DELIVERED" && (
                <button
                  onClick={() => handleOpenMedia(latest.media)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem ảnh bàn giao
                </button>
              )}
            </p>
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
                {console.log("item media:", item.status, item.media)}
                {/* === NÚT HIỆN ẢNH BÀN GIAO === */}
                {item.status === "DELIVERED" && (
                  <button
                    onClick={() => handleOpenMedia(item.media)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Xem ảnh bàn giao
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL HIỂN THỊ ẢNH === */}
      <DeliveryMediaModal
        open={openMedia}
        mediaString={mediaString}
        onClose={() => setOpenMedia(false)}
      />
    </div>
  )
}
