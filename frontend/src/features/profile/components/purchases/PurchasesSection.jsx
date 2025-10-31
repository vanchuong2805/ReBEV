import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getOrderByCustomer } from '@/features/profile/service'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'

import PendingPurchaseCard from '@/features/profile/components/purchases/PendingPurchaseCard'
import ProcessingPurchaseCard from '@/features/profile/components/purchases/ProcessingPurchaseCard'
import ShippingPurchaseCard from '@/features/profile/components/purchases/ShippingPurchaseCard'
import SuccessPurchases from '@/features/profile/components/purchases/SuccessPurchases'
import CanceledPurchaseCard from '@/features/profile/components/purchases/CanceledPurchaseCard'
import RefundedPurchaseCard from '@/features/profile/components/purchases/RefundedPurchaseCard'
import ReviewModal from '@/features/profile/components/ReviewModal'

const PurchasesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const navigate = useNavigate()
  const { user } = useUser()

  const getStatus = (order) => order.order_statuses?.at(-1)?.status || ""

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const data = await getOrderByCustomer(user.id)
        console.log(" Đơn mua tải về:", data)
        setOrders(data || [])
      } catch (error) {
        console.error(" Lỗi tải đơn hàng:", error)
      }
    }
    fetchOrders()
  }, [user])

  // ✅ Mở modal đánh giá
  const handleReview = (purchase) => {
    setSelectedOrder(purchase)
    setShowReview(true)
  }

  // ✅ Gom trạng thái
  const pendingOrders = orders.filter(o => getStatus(o) === 'PAID')
  const processingOrders = orders.filter(o => getStatus(o) === 'CONFIRMED')
  const shippingOrders = orders.filter(o => getStatus(o) === 'DELIVERING')
  const successOrders = orders.filter(o => getStatus(o) === 'COMPLETED')
  const canceledOrders = orders.filter(o => getStatus(o) === 'CANCELLED')
  const refundedOrders = orders.filter(o => getStatus(o) === 'Đã hoàn tiền')
  const total = pendingOrders.length + processingOrders.length + shippingOrders.length + successOrders.length + canceledOrders.length + refundedOrders.length

  const handleView = (order) => {
    navigate(`/profile/purchases/${order.id}`, {
      state: { from: `/profile/purchases?type=${type}` },
    })
  }

  // ✅ Hàm render từng card
  const renderPurchaseCard = (order) => {
    const s = getStatus(order)

    const renderDetails = (CardComponent, extraProps = {}) =>
      order.order_details.map((detail) => {
        return (
          <CardComponent
            key={detail.id}
            detail={detail}
            purchase={detail.post}
            
            onView={() => handleView(order)}
            {...extraProps}
          />
        )
      })

    return (
      <div key={order.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-2 text-gray-800">Đơn hàng #{order.id}</h3>

        {s === "PAID" && renderDetails(PendingPurchaseCard)}
        {s === "CONFIRMED" && renderDetails(ProcessingPurchaseCard)}
        {s === "DELIVERING" && renderDetails(ShippingPurchaseCard)}
        {s === "COMPLETED" && renderDetails(SuccessPurchases, { onReview: handleReview })}
        {s === "CANCELLED" && renderDetails(CanceledPurchaseCard)}
        {s === "Đã hoàn tiền" && renderDetails(RefundedPurchaseCard)}
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đơn mua của tôi</CardTitle>
              <CardDescription>Tất cả đơn bạn đã tạo / đang xử lý</CardDescription>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Car className="w-4 h-4 mr-2" />
              Mua tiếp
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={type} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="all">Tất cả ({total})</TabsTrigger>
              <TabsTrigger value="pending">Chờ xác nhận ({pendingOrders.length})</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý ({processingOrders.length})</TabsTrigger>
              <TabsTrigger value="shipping">Đang vận chuyển ({shippingOrders.length})</TabsTrigger>
              <TabsTrigger value="success">Hoàn tất ({successOrders.length})</TabsTrigger>
              <TabsTrigger value="canceled">Đã huỷ ({canceledOrders.length})</TabsTrigger>
              <TabsTrigger value="refunded">Đã hoàn tiền ({refundedOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {total === 0
                ? <div className="text-center py-12 text-gray-500">Chưa có đơn mua</div>
                : orders.map(renderPurchaseCard)}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingOrders.length === 0
                ? <div className="text-gray-500">Không có đơn chờ xác nhận</div>
                : pendingOrders.map(renderPurchaseCard)}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              {processingOrders.length === 0
                ? <div className="text-gray-500">Không có đơn đang xử lý</div>
                : processingOrders.map(renderPurchaseCard)}
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              {shippingOrders.length === 0
                ? <div className="text-gray-500">Không có đơn đang vận chuyển</div>
                : shippingOrders.map(renderPurchaseCard)}
            </TabsContent>

            <TabsContent value="success" className="space-y-4">
              {successOrders.length === 0
                ? <div className="text-gray-500">Không có đơn hoàn tất</div>
                : successOrders.map(renderPurchaseCard)}
            </TabsContent>

            <TabsContent value="canceled" className="space-y-4">
              {canceledOrders.length === 0
                ? <div className="text-gray-500">Không có đơn đã huỷ</div>
                : canceledOrders.map(renderPurchaseCard)}
            </TabsContent>

            <TabsContent value="refunded" className="space-y-4">
              {refundedOrders.length === 0
                ? <div className="text-gray-500">Không có đơn đã hoàn tiền</div>
                : refundedOrders.map(renderPurchaseCard)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ✅ Modal đánh giá */}
      <ReviewModal
        open={showReview}
        onClose={() => setShowReview(false)}
        purchase={selectedOrder}
        onSubmit={(data) => {
          console.log("📤 Review gửi server:", data)
          setShowReview(false)
        }}
      />
    </>
  )
}

export default PurchasesSection
