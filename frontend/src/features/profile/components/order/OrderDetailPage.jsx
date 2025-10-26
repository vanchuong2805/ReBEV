import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, Settings, Truck, CheckCircle, MessageCircle, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockPurchases, order_status } from "@/features/profile/components/purchases/MockPurchases"

const steps = [
  { label: "Chờ xác nhận", icon: Clock },
  { label: "Đang xử lý", icon: Settings },
  { label: "Đang vận chuyển", icon: Truck },
  { label: "Hoàn tất", icon: CheckCircle },
]

const money = n => n?.toLocaleString("vi-VN") + " ₫"

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = mockPurchases.find(o => o.id === Number(orderId))
  if (!order)
    return <div className="text-center py-20 text-gray-500">Không tìm thấy đơn hàng</div>

  const progressIndex = steps.findIndex(s =>
    order.status_vi.toLowerCase().includes(s.label.toLowerCase())
  )

  const timeline = order_status
    .filter(s => s.order_id === order.id)
    .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* ==== HEADER ==== */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#007BFF] font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TRỞ LẠI</span>
          </button>

          <div className="text-right">
            <p className="text-sm text-gray-600">
              MÃ ĐƠN HÀNG: <span className="font-semibold">{order.id}</span>
            </p>
            <p className="text-sm text-[#007BFF] font-semibold">
              {order.status_vi.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ==== PROGRESS BAR ==== */}
        <Card className="p-8 mb-6 bg-white shadow-sm">
          <div className="flex items-center justify-between relative mb-2">
            {steps.map((step, i) => {
              const Icon = step.icon
              const done = i <= progressIndex
              const isLast = i === steps.length - 1

              // Màu xanh ReBEV và xám
              const bgColor = done
                ? i === steps.length - 1
                  ? "bg-green-500"
                  : "bg-[#007BFF]"
                : "bg-gray-200"

              const textColor = done ? "text-white" : "text-gray-400"

              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center relative z-10"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${bgColor} ${textColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Label */}
                  <p
                    className={`text-sm mt-3 ${
                      done ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  {/* Date */}
                  <p className="text-xs text-gray-400 mt-1">
                    {done ? new Date().toLocaleDateString("vi-VN") : "Vui lòng chờ"}
                  </p>

                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className="absolute top-6 left-1/2 h-0.5 transition-all duration-300"
                      style={{
                        width: "100%",
                        backgroundColor: done ? "#007BFF" : "#E5E7EB",
                        zIndex: -1,
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            Cảm ơn bạn đã mua sắm tại{" "}
            <span className="font-semibold text-[#007BFF]">ReBEV</span>!
          </p>
        </Card>

        {/* ==== ĐỊA CHỈ + TIMELINE ==== */}
        <Card className="p-6 mb-6 bg-white">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">
            Địa Chỉ Nhận Hàng
          </h3>

          <div className="grid grid-cols-2 gap-8">
            {/* Left: Address Info */}
            <div>
              <p className="font-semibold text-gray-900 mb-1">Tú Anh</p>
              <p className="text-sm text-gray-600 mb-1">(+84) 0123 456 789</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tòa nhà FPT University, Quận 9, TP.HCM
              </p>
            </div>

            {/* Right: Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#007BFF]" />
                <div>
                  <p className="text-sm font-medium text-[#007BFF]">
                    {timeline[0]?.description || "Đã giao"}
                  </p>
                  <p className="text-xs text-gray-500">Giao hàng thành công</p>
                </div>
              </div>

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
                        <p className="text-sm text-gray-900 flex-1">{item.description}</p>
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
          </div>
        </Card>

        {/* ==== SẢN PHẨM ==== */}
        <Card className="p-6 mb-6 bg-white">
          {/* Store Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <div className="bg-[#007BFF] text-white text-xs font-bold px-2 py-1 rounded">
              MALL
            </div>
            <span className="font-medium text-gray-900">ReBEV Store</span>
            <Button size="sm" className="bg-[#007BFF] hover:bg-[#0066d1] text-white ml-auto h-7 px-4">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-4 border-[#007BFF] text-[#007BFF] hover:bg-[#E6F0FF]">
              <Store className="w-3 h-3 mr-1" />
              Xem Shop
            </Button>
          </div>

          {/* Product Info */}
          <div className="flex gap-4">
            <img
              src={order.thumbnail_url}
              alt={order.title}
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1">
              <h3 className="text-sm text-gray-900 leading-tight">{order.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Phân loại hàng: {order.category_name}
              </p>
              <p className="text-xs text-gray-500">x1</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#007BFF] font-medium">{money(order.line_price)}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="text-gray-900">{money(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-gray-900">{money(order.shipping_price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Đã thanh toán</span>
              <span className="text-gray-900">{money(order.paid_amount)}</span>
            </div>

            <div className="flex justify-between text-base font-medium pt-2 border-t">
              <span className="text-gray-900">Thành tiền</span>
              <span className="text-[#007BFF] text-lg">{money(order.total_amount + order.shipping_price - order.paid_amount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 h-11 border-[#007BFF] text-[#007BFF] hover:bg-[#E6F0FF]">
              Liên Hệ Người Bán
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
