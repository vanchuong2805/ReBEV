// src/features/profile/components/purchases/PurchaseFooter.jsx
import { Button } from '@/components/ui/button'

export default function PurchaseFooter({ order, price, status, onCancel, onComplete, onView }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-gradient-to-r from-white to-gray-50 rounded-b-lg">
      {/* Tổng tiền / Tiền cọc */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">
          {order.delivery_price === 0 ? "Tiền cọc: " : "Tổng tiền: "}
        </p>
        <p className="text-lg font-semibold text-gray-900 tracking-wide">
            {price!=null ? price.toLocaleString("vi-VN")  + " ₫" : (order.total_amount + order.delivery_price)?.toLocaleString("vi-VN")  + " ₫"}
        
          
        </p>
      </div>

      {/* Nút hành động */}
      <div className="flex gap-2">
        {status === "PAID" && (
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4"
            onClick={() => onCancel(order)}
          >
            Huỷ đơn
          </Button>
        )}
        {status === "DELIVERED" && (
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4"
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
