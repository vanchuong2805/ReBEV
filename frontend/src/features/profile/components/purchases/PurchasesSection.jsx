import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MessageCircle, Store } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getOrderByCustomer, getUserById, changeOrderStatus, getComplaintByUserId } from '@/features/profile/service'

import PendingPurchaseCard from '@/features/profile/components/purchases/PendingPurchaseCard'
import ProcessingPurchaseCard from '@/features/profile/components/purchases/ProcessingPurchaseCard'
import ShippingPurchaseCard from '@/features/profile/components/purchases/ShippingPurchaseCard'
import SuccessPurchases from '@/features/profile/components/purchases/SuccessPurchases'
import CanceledPurchaseCard from '@/features/profile/components/purchases/CanceledPurchaseCard'
import RefundedPurchaseCard from '@/features/profile/components/purchases/RefundedPurchaseCard'
import ReviewModal from '@/features/profile/components/ReviewModal'
import ComplaintModal from '@/features/profile/components/purchases/ComplaintModal'
import PurchaseFooter from './PurchaseFooter'
import PurchaseHeader from './PurchaseHeader'

const PurchasesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showComplaint, setShowComplaint] = useState(false)
  const [complaints, setComplaints] = useState([])

  const navigate = useNavigate()
  const { user } = useUser()

  const getStatus = (order) => order?.order_statuses?.at(-1)?.status || ""

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const res = await getOrderByCustomer(user.id)
        const data = res.orders
        const res1 = await getComplaintByUserId(user.id)
        const withSeller = await Promise.all(
          data.map(async (order) => {
            const seller = await getUserById(order.seller_id)
            return { ...order, seller_info: seller }
          })
        )
        const withSeller1 = await Promise.all(
          res1.map(async (c) => {
            const sellerId = c.order_detail?.post?.user_id
            if (!sellerId) return c
            const seller = await getUserById(sellerId)
            return { ...c, seller_info: seller }
          })
        )
        console.log(" Đơn mua tải về:", withSeller)
        console.log(" Đơn khiếu nại tải về:", withSeller1)
        setOrders(withSeller)
        setComplaints(withSeller1)

      } catch (error) {
        console.error(" Lỗi tải đơn hàng:", error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  // === Mở modal đánh giá ===
  const handleReview = (purchase) => {
    setSelectedOrder(purchase)
    setShowReview(true)
  }

  // === Mở modal yêu cầu hoàn tiền ===
  const handleComplaint = (purchase) => {
    setSelectedOrder(purchase)
    setShowComplaint(true)
  }

  // === Huỷ đơn hàng ===
  const handleCancel = async (order) => {
    if (!window.confirm(" Bạn có chắc muốn huỷ đơn hàng này không?")) return
    try {
      await changeOrderStatus(order.id, "CANCELLED", "Người mua đã huỷ đơn hàng")
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, order_statuses: [...o.order_statuses, { status: "CANCELLED" }] }
            : o
        )
      )
      alert("Đơn hàng đã được huỷ thành công!")
    } catch (error) {
      console.error("Lỗi khi huỷ đơn:", error)
      alert("Huỷ đơn thất bại, vui lòng thử lại.")
    }
  }
  //
  const handleComplete = async (order) => {
    if (!window.confirm(" Bạn có chắc muốn hoàn tất đơn hàng này không?")) return
    try {
      await changeOrderStatus(order.id, "COMPLETED", "Người mua đã hoàn tất đơn hàng")
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, order_statuses: [...o.order_statuses, { status: "COMPLETED" }] }
            : o
        )
      )
      alert(" Đơn hàng đã được hoàn tất thành công!")
    } catch (error) {
      console.error("Lỗi khi hoàn tất đơn:", error)
      alert("Hoàn tất đơn thất bại, vui lòng thử lại.")
    }
  }

  // === Gom nhóm trạng thái ===
  const pendingOrders = orders.filter(o => getStatus(o) === 'PAID')
  const processingOrders = orders.filter(o => getStatus(o) === 'CONFIRMED')
  const shippingOrders = orders.filter(o => getStatus(o) === 'DELIVERING')
  const successOrders = orders.filter(o => ['COMPLETED', 'DELIVERED'].includes(getStatus(o)))
  const canceledOrders = orders.filter(o =>
    ['CANCELLED', 'CUSTOMER_CANCELLED', 'SELLER_CANCELLED', 'FAIL_PAY'].includes(getStatus(o))
  )
  const refundedOrders = complaints
  const total = orders.length
  const handleView = (order) => {
    navigate(`/profile/purchases/${order.id}`, {
      state: { from: `/profile/purchases?type=${type}` },
    })
  }

  // === Hàm render từng card đơn ===
  const renderPurchaseCard = (order) => {
    const s = getStatus(order)

    const renderDetails = (CardComponent, extraProps = {}) =>
      order.order_details.map((detail) => (
        <CardComponent
          key={detail.id}
          detail={detail}
          status={getStatus(order)}
          purchase={detail.post}
          onView={() => handleView(order)}
          {...extraProps}
        />
      ))

    return (
      <div key={order.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
        <PurchaseHeader order={order} seller={order.seller_info} />

        {/* Nội dung đơn hàng */}
        {s === "PAID" && renderDetails(PendingPurchaseCard)}
        {s === "CONFIRMED" && renderDetails(ProcessingPurchaseCard)}
        {s === "DELIVERING" && renderDetails(ShippingPurchaseCard)}
        {['COMPLETED', 'DELIVERED'].includes(s) &&
          renderDetails(
            SuccessPurchases,
            {
              ...(s === 'COMPLETED' ? { onReview: handleReview } : {}),
              ...(s === 'DELIVERED' ? { onComplaint: handleComplaint } : {}),
            }
          )
        }
        {['CANCELLED', 'CUSTOMER_CANCELLED', 'SELLER_CANCELLED', 'FAIL_PAY'].includes(s) &&
          renderDetails(CanceledPurchaseCard)}


        <PurchaseFooter
          order={order}
          status={s}
          onCancel={handleCancel}
          onComplete={handleComplete}
          onView={handleView}
        />
      </div>
    )
  }
  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Đang tải danh sách đơn bán...
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
              <CardDescription>Quản lý tất cả đơn mua theo trạng thái</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={type} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="all">Tất cả </TabsTrigger>
              <TabsTrigger value="pending">Chờ xác nhận </TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý </TabsTrigger>
              <TabsTrigger value="shipping">Đang vận chuyển </TabsTrigger>
              <TabsTrigger value="success">Hoàn tất </TabsTrigger>
              <TabsTrigger value="canceled">Đã huỷ </TabsTrigger>
              <TabsTrigger value="refunded">hoàn tiền </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {orders.length === 0
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
                : refundedOrders.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
                    >
                      <PurchaseHeader order={item} seller={item.seller_info} />

                      <RefundedPurchaseCard
                        purchase={item.order_detail?.post || { title: "Không rõ sản phẩm" }}
                        onView={() =>
                          navigate(`/profile/purchases/${item.order_detail?.order_id}`)
                        }
                        onSupport={() =>
                          window.open(
                            "mailto:support@rebev.vn?subject=Hỗ trợ hoàn tiền #" + item.id
                          )
                        }
                      />

                      <PurchaseFooter
                        order={item || {}}
                        price={item.order_detail.price }
                        status="REFUNDED"
                        onView={() =>
                          navigate(`/profile/purchases/${item.order_detail?.order_id}`)
                        }
                      />
                    </div>
                  )
                }

                )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal đánh giá */}
      <ReviewModal
        open={showReview}
        onClose={() => setShowReview(false)}
        purchase={selectedOrder}
        onSubmit={(data) => {
          console.log("📤 Review gửi server:", data)
          setShowReview(false)
        }}
      />
      {/* Modal khiếu nại / hoàn tiền */}
      <ComplaintModal
        open={showComplaint}
        onClose={() => setShowComplaint(false)}
        purchase={selectedOrder}
      />
    </>
  )
}

export default PurchasesSection
