import { Button } from "@/components/ui/button"

export default function SaleFooter({
  order,
  status,
  onAccept,
  onCancel,
  onDelivering,
  onView,
  onDelivered,
  onReturned,
}) {

  const isDeposit = order.order_type === 2

  const appointmentTime = order?.order_details?.[0]?.appointment_time

  const appointmentLabel = isDeposit
    ? "Lịch hẹn lấy xe"
    : "Lịch hẹn giao pin"

  const formattedDate = appointmentTime
    ? new Date(appointmentTime).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-5 border-t bg-gradient-to-r from-white to-slate-50 rounded-b-lg shadow-inner">
      {/* Tổng tiền + lịch hẹn */}
      <div className="text-center sm:text-left space-y-1">
        <p className="text-sm text-gray-500">
          {isDeposit ? "Tiền cọc:" : "Tổng tiền:"}
        </p>
        <p className="text-lg font-semibold text-gray-900 tracking-wide">
          {(order.total_amount + order.delivery_price)?.toLocaleString("vi-VN")} ₫
        </p>

        {/* Hiển thị lịch hẹn nếu có */}
        {formattedDate && (
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium text-gray-700">{appointmentLabel}:</span>{" "}
            {formattedDate}
          </p>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        {status === "PAID" && (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAccept(order)}
            >
              Xác nhận đơn
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => onCancel(order)}
            >
              Huỷ đơn
            </Button>
          </>
        )}
        {status === "DELIVERING" && !isDeposit &&(
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onDelivered(order)}
          >
            Đã giao cho khách
          </Button>
        )}

        {/* Đơn cọc (xe) → sau khi xác nhận thì chuyển sang bàn giao */}
        {status === "CONFIRMED" && !isDeposit && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onDelivering(order)}
          >
            Đã bàn giao
          </Button>
        )}

        {status === "RETURNING" && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-md font-medium transition-all duration-200"
            onClick={() => onReturned(order)}
          >
            Đã nhận
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="text-[#007BFF] border-[#007BFF] hover:bg-[#E6F0FF]"
          onClick={() => onView(order)}
        >
          Xem chi tiết
        </Button>

      </div>
    </div>
  )
}
