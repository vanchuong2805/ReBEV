import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MessageCircle, Store } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getOrderBySeller, changeOrderStatus } from '@/features/profile/service'

import GenericSaleCard from '@/features/profile/components/sales/GenericSaleCard'

const SalesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useUser()

  const getStatus = (order) => order?.order_statuses?.at(-1)?.status || ""


  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const res = await getOrderBySeller(user.id)
        const data = res.orders
        console.log(" Đơn bán tải về:", data)
        setOrders(data)
      } catch (error) {
        console.error(" Lỗi tải đơn bán:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])


  const handleAccept = async (order) => {
    try {
      await changeOrderStatus(order.id, "CONFIRMED", "Người bán đã xác nhận đơn hàng")
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, order_statuses: [...o.order_statuses, { status: "CONFIRMED" }] }
            : o
        )
      )
      alert(" Đã xác nhận đơn hàng thành công!")
    } catch (error) {
      console.error(" Lỗi khi xác nhận đơn hàng:", error)
      alert("Xác nhận thất bại, vui lòng thử lại.")
    }
  }

  const handleCancel = async (order) => {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn này không?")) return
    try {
      await changeOrderStatus(order.id, "CANCELLED", "Người bán đã huỷ đơn hàng")
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, order_statuses: [...o.order_statuses, { status: "CANCELLED" }] }
            : o
        )
      )
      alert(" Đơn hàng đã được huỷ thành công.")
    } catch (error) {
      console.error(" Lỗi khi huỷ đơn:", error)
      alert("Huỷ đơn thất bại, vui lòng thử lại.")
    }
  }

  const handleComplete = async (order) => {
    if (!window.confirm("Xác nhận đã giao hàng thành công?")) return
    try {
      await changeOrderStatus(order.id, "COMPLETED", "Người bán đã hoàn tất đơn hàng")
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, order_statuses: [...o.order_statuses, { status: "COMPLETED" }] }
            : o
        )
      )
      alert(" Đơn hàng đã được đánh dấu là hoàn tất.")
    } catch (error) {
      console.error(" Lỗi khi hoàn tất đơn:", error)
      alert("Hoàn tất đơn thất bại, vui lòng thử lại.")
    }
  }

  const handleView = (order) => {
    navigate(`/profile/sale/${order.id}`, {
      state: { from: `/profile/sales?type=${type}` },
    })
  }

  const pendingOrders = orders.filter(o => getStatus(o) === 'PAID')
  const processingOrders = orders.filter(o => getStatus(o) === 'CONFIRMED')
  const shippingOrders = orders.filter(o => getStatus(o) === 'DELIVERING')
  const successOrders = orders.filter(o => ['COMPLETED', 'DELIVERED'].includes(getStatus(o)))
  const canceledOrders = orders.filter(o =>
    ['CANCELLED', 'CUSTOMER_CANCELLED', 'SELLER_CANCELLED', 'FAIL_PAY'].includes(getStatus(o))
  )

  const total = orders.length

  const renderSaleCard = (order) => {
    const s = getStatus(order)

    return (
      <div key={order.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
        {/* === Header === */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
          <img
            src={order.customer?.avatar || "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg"}
            alt="customer avatar"
            className="w-8 h-8 rounded-full border object-cover"
          />
          <span className="font-medium text-gray-900">
            Người mua:{" "}
            <span className="text-gray-800">
              {order.customer?.display_name || "Ẩn danh"}
            </span>
          </span>

          <Button
            size="sm"
            className="bg-[#007BFF] hover:bg-[#0066d1] text-white ml-auto h-7 px-4"
            onClick={() => navigate(`/chat?buyer=${order.customer.id}&seller=${user.id}`)}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-4 border-[#007BFF] text-[#007BFF] hover:bg-[#E6F0FF]"
            onClick={() => navigate(`/shop/${order.customer.id}`)}
          >
            <Store className="w-3 h-3 mr-1" />
            Xem Shop
          </Button>
        </div>

        {/* === Nội dung === */}
        <div className="p-5 space-y-4 bg-gray-50">
          {order.order_details.map((detail) => {
            const product = detail.post
            let type = "pending"
            if (s === "CONFIRMED") type = "processing"
            else if (s === "DELIVERING") type = "shipping"
            else if (["COMPLETED", "DELIVERED"].includes(s)) type = "success"
            else if (["CANCELLED", "CUSTOMER_CANCELLED", "SELLER_CANCELLED", "FAIL_PAY"].includes(s)) type = "canceled"

            return (
              <GenericSaleCard
                key={detail.id}
                type={type}
                sale={product}
              />
            )
          })}
        </div>

        {/* === Footer === */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t bg-white">
          {/* Tổng tiền */}
          <div className="flex flex-col items-center sm:items-start space-y-1">
            <p className="text-sm text-gray-500">
              {order.delivery_price === 0 ? "Tiền cọc:" : "Tổng tiền:"}
            </p>
            <p className="text-xl font-semibold text-gray-900 tracking-wide">
              {(order.total_amount + order.delivery_price)?.toLocaleString("vi-VN")} ₫
            </p>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            {s === "PAID" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAccept(order)}
                >
                  Xác nhận đơn
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleCancel(order)}
                >
                  Huỷ đơn
                </Button>
              </>
            )}

            {s === "DELIVERING" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleComplete(order)}
              >
                Hoàn tất đơn
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              className="text-[#007BFF] border-[#007BFF] hover:bg-[#E6F0FF]"
              onClick={() => handleView(order)}
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // === Loading ===
  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Đang tải danh sách đơn bán...
      </div>
    )
  }

  // === UI chính ===
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Đơn bán của tôi</CardTitle>
            <CardDescription>Quản lý tất cả đơn bán theo trạng thái</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={type} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all" className="text-sm">Tất cả</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="processing" className="text-sm">Đang xử lý</TabsTrigger>
            <TabsTrigger value="shipping" className="text-sm">Đang vận chuyển</TabsTrigger>
            <TabsTrigger value="success" className="text-sm">Hoàn tất</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Đã huỷ</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {total === 0 ? (
              <div className="text-center py-12 text-gray-500">Chưa có đơn bán</div>
            ) : (
              orders.map(renderSaleCard)
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0 ? (
              <div className="text-gray-500">Không có đơn chờ xác nhận</div>
            ) : (
              pendingOrders.map(renderSaleCard)
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {processingOrders.length === 0 ? (
              <div className="text-gray-500">Không có đơn đang xử lý</div>
            ) : (
              processingOrders.map(renderSaleCard)
            )}
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {shippingOrders.length === 0 ? (
              <div className="text-gray-500">Không có đơn đang vận chuyển</div>
            ) : (
              shippingOrders.map(renderSaleCard)
            )}
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            {successOrders.length === 0 ? (
              <div className="text-gray-500">Không có đơn hoàn tất</div>
            ) : (
              successOrders.map(renderSaleCard)
            )}
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {canceledOrders.length === 0 ? (
              <div className="text-gray-500">Không có đơn đã huỷ</div>
            ) : (
              canceledOrders.map(renderSaleCard)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default SalesSection
