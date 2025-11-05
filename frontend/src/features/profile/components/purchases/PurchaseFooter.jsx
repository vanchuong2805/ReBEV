import { Button } from "@/components/ui/button"

export default function PurchaseFooter({
  order,
  price,
  status,
  onCancel,
  onComplete,
  onView,
}) {
  const isDeposit = order.delivery_price === 0
  const displayPrice =
    price != null
      ? price.toLocaleString("vi-VN")
      : (order.total_amount + order.delivery_price)?.toLocaleString("vi-VN")

  const totalLabel = isDeposit ? "Tiền cọc" : "Tổng tiền"

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t bg-gradient-to-r from-white to-[#f9fbff]">
      {/* 💰 Thông tin tiền */}
      <div className="text-center sm:text-left space-y-1">
        <p className="text-sm text-gray-500">{totalLabel}</p>
        <p className="text-xl font-semibold text-gray-900">{displayPrice} ₫</p>
      </div>


      {/* ⚙️ Các nút hành động */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        {status === "PAID" && (
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-md font-medium"
            onClick={() => onCancel(order)}
          >
            Huỷ đơn
          </Button>
        )}

        {status === "DELIVERED" && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-md font-medium"
            onClick={() => onComplete(order)}
          >
            Xác nhận
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          className="text-[#007BFF] border-[#007BFF] hover:bg-[#E6F0FF] hover:shadow-sm px-5 rounded-md font-medium"
          onClick={() => onView(order)}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}
