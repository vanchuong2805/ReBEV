export default function OrderSummary({ order }) {
  const money = (n) => (n ? n.toLocaleString("vi-VN") + " ₫" : "0 ₫")

  return (
    <div className="p-6 bg-white border rounded shadow-sm">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tổng tiền hàng</span>
        <span className="text-gray-900">{money(order.total_amount)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Phí vận chuyển</span>
        <span className="text-gray-900">{money(order.delivery_price)}</span>
      </div>
      <div className="flex justify-between text-base font-medium pt-2 border-t mt-3">
        <span className="text-gray-900">Thành tiền</span>
        <span className="text-[#007BFF] text-lg">
          {money(order.total_amount + order.delivery_price)}
        </span>
      </div>
    </div>
  )
}
