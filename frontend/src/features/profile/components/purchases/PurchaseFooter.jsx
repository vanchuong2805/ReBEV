import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export default function PurchaseFooter({
  order,
  price,
  status,
  onCancel,
  onComplete,
  onView,
  onUpdateAppointment,
}) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // 🔹 1 = xe (cọc), khác = pin
  const isDeposit = order.order_type === 2

  // 🔹 Hiển thị giá
  const displayPrice =
    price != null
      ? price.toLocaleString("vi-VN")
      : (order.total_amount + order.delivery_price)?.toLocaleString("vi-VN")

  const totalLabel = isDeposit ? "Tiền cọc" : "Tổng tiền"

  // 🔹 Lấy lịch hẹn (nếu có)
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

  // 🔹 Cập nhật lịch hẹn
  const handleConfirmDate = async () => {
    if (!selectedDate) return alert("Vui lòng chọn ngày hẹn!")
    const appointment_time = new Date(selectedDate).toISOString()
    await onUpdateAppointment(order, appointment_time)
    setOpen(false)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-5 border-t bg-gradient-to-r from-white to-slate-50 rounded-b-lg shadow-inner">
      {/* Tổng tiền + lịch hẹn */}
      <div className="text-center sm:text-left space-y-1">
        <p className="text-sm text-gray-500">{totalLabel}</p>
        <p className="text-lg font-semibold text-gray-900 tracking-wide">
          {displayPrice} ₫
        </p>

        {formattedDate && (
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium text-gray-700">{appointmentLabel}:</span>{" "}
            {formattedDate}
          </p>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        {/* 🔴 Khi đơn hàng đang ở trạng thái PAID */}
        {status === "PAID" && (
          <>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-md font-medium transition-all duration-200"
              onClick={() => onCancel(order)}
            >
              Huỷ đơn
            </Button>

            {/* 🗓️ Chỉ xe mới có thể đổi lịch */}
            {isDeposit && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cập nhật lịch hẹn
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                  />
                  <Button
                    onClick={handleConfirmDate}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    Xác nhận ngày hẹn
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </>
        )}

        {/* 🟢 Khi hàng đã giao mà chưa có khiếu nại */}
        {status === "DELIVERED" &&
          !order?.order_details?.[0]?.complaints?.length > 0 && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-md font-medium transition-all duration-200"
              onClick={() => onComplete(order)}
            >
              Xác nhận
            </Button>
          )}

        {/* 🔵 Nút xem chi tiết */}
        <Button
          size="sm"
          variant="outline"
          className="text-[#007BFF] border-[#007BFF] hover:bg-[#E6F0FF] hover:shadow-sm px-5 rounded-md font-medium transition-all duration-200"
          onClick={() => onView(order)}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}
