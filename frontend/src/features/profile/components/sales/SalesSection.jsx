import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContext"
import {
  getOrderBySeller,
  getOrderBySellerRefunds,
  changeOrderStatus,
} from "@/features/profile/service"

import GenericSaleCard from "@/features/profile/components/sales/GenericSaleCard"
import SaleHeader from "@/features/profile/components/sales/SaleHeader"
import SaleFooter from "@/features/profile/components/sales/SaleFooter"
import DeliveryProofModal from "@/features/profile/components/sales/DeliveryProofModal"
import { toast } from "sonner"

const SalesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useUser()
  const [proofModal, setProofModal] = useState({ open: false, order: null })

  const getStatus = (order) =>
  order?.order_statuses?.at(-1)?.status ||
  order?.order_status?.at(-1)?.status ||
  ""

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const res = await getOrderBySeller(user.id)
        const refundRes = await getOrderBySellerRefunds(user.id)
        setOrders(res.orders || [])
        setRefunds(refundRes.orders || [])
        console.log("Đơn bán:", res.orders)
        console.log("Đơn hoàn trả:", refundRes.orders)
      } catch (error) {
        console.error("Lỗi tải đơn bán:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // === Cập nhật trạng thái đơn ===
  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, order_statuses: [...o.order_statuses, { status }] } : o
      )
    )
  }

  const handleAccept = async (order) => {
    await changeOrderStatus(order.id, "CONFIRMED", "Người bán đã xác nhận đơn hàng")
    updateOrderStatus(order.id, "CONFIRMED")
    toast.success("Đã xác nhận đơn hàng thành công!")
  }

  const handleCancel = async (order) => {
    await changeOrderStatus(order.id, "CANCELLED", "Người bán đã huỷ đơn hàng")
    updateOrderStatus(order.id, "CANCELLED")
    toast.success("Đơn hàng đã được huỷ thành công.")
  }

  const handleDelivering = async (order) => {
    await changeOrderStatus(order.id, "DELIVERING", "Đơn hàng đã bàn giao")
    updateOrderStatus(order.id, "DELIVERING")
    toast.success("Đơn hàng đã được chuyển sang trạng thái 'Đang vận chuyển'.")
  }

  const handleComplete = async (order) => {
    await changeOrderStatus(order.id, "COMPLETED", "Người bán đã hoàn tất đơn hàng")
    updateOrderStatus(order.id, "COMPLETED")
    toast.success("Đơn hàng đã được đánh dấu là hoàn tất.")
  }

  const handleView = (order) => {
    navigate(`/profile/sale/${order.id}`, {
      state: { from: `/profile/sales?type=${type}` },
    })
  }
  const handleDelivered = (order) => {
    setProofModal({ open: true, order })
  }

  const submitDelivered = async ({ orderId, media }) => {
    try {
      await changeOrderStatus(orderId, "DELIVERED","Đã giao hàng", media)
      updateOrderStatus(orderId, "DELIVERED")
      toast.success("Đã cập nhật trạng thái thành công: ĐÃ GIAO HÀNG.")
    } catch (err) {
      console.error(err)
      toast.error("Lỗi khi cập nhật trạng thái.")
    }
  }
  const handleReturned = async (order) => {
    if (!window.confirm("Xác nhận bạn đã nhận hàng hoàn trả?")) return
    try {
      await changeOrderStatus(order.id, "RETURNED", "Người bán đã nhận hàng hoàn trả")
      setRefunds((prev) =>
        prev.map((c) =>
          c.id === order.id
            ? { ...c, order_statuses: [...c.order_statuses, { status: "RETURNED" }] }
            : c
        )
      )
      console.log("Đơn hoàn trả đã cập nhật:", order.id)
      toast.success("Trạng thái đơn đã cập nhật sang 'Đã nhận hàng hoàn trả'.")
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hoàn trả:", error)
      toast.error("Cập nhật trạng thái thất bại, vui lòng thử lại.")
    }
  }

  // === Phân loại trạng thái ===
  const pendingOrders = orders.filter((o) => getStatus(o) === "PAID")
  const processingOrders = orders.filter((o) => getStatus(o) === "CONFIRMED")
  const shippingOrders = orders.filter((o) => getStatus(o) === "DELIVERING")
  const successOrders = orders.filter((o) =>
    ["COMPLETED", "DELIVERED"].includes(getStatus(o))
  )
  const canceledOrders = orders.filter((o) =>
    ["CANCELLED", "CUSTOMER_CANCELLED", "SELLER_CANCELLED", "FAIL_PAY"].includes(
      getStatus(o)
    )
  )
  const refundedOrders = refunds
  const total = orders.length

  // === Render từng thẻ đơn bán ===
  const renderSaleCard = (order) => {
    const status = getStatus(order)
    return (
      <div
        key={order.id}
        className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
      >
        <SaleHeader customer={order.customer} />

        {order.order_details.map((detail) => {
          const product = detail.post
          return (
            <GenericSaleCard
              key={detail.id}
              detail={detail}
              post={product}
              type={
                status === "PAID"
                  ? "pending"
                  : status === "CONFIRMED"
                    ? "processing"
                    : status === "DELIVERING"
                      ? "shipping"
                      : ["COMPLETED", "DELIVERED"].includes(status)
                        ? "success"
                        : ["CANCELLED", "CUSTOMER_CANCELLED", "SELLER_CANCELLED", "FAIL_PAY"].includes(status)
                          ? "canceled"
                          : "refunded"
              }
            />
          )
        })}

        <SaleFooter
          order={order}
          status={status}
          onAccept={handleAccept}
          onCancel={handleCancel}
          onDelivering={handleDelivering}
          onDelivered={handleDelivered}
          onComplete={handleComplete}
          onView={handleView}
        />
      </div>
    )
  }

  // === Render đơn hoàn trả ===
  const renderRefundCard = (item) => {
    const status = getStatus(item)
    return (
      <div
        key={item.id}
        className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
      >
        <SaleHeader customer={item.customer} />
        <GenericSaleCard
          post={item.order_details?.[0].post || { title: "Không rõ sản phẩm" }}
          detail={item.order_details?.[0]}
          status={status}
          type="refunded"
        />
        <SaleFooter
          order={item}
          status={status}
          onView={() =>
            navigate(`/profile/returns/${item.id}`, {
              state: { order: item },
            })
          }
          onReturned={handleReturned}
        />
      </div>
    )
  }

  // === Khi đang tải ===
  if (loading)
    return (
      <div className="text-center py-16 text-gray-500">
        Đang tải danh sách đơn bán...
      </div>
    )

  // === Giao diện chính ===
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đơn bán của tôi</CardTitle>
              <CardDescription>
                Quản lý tất cả đơn bán theo trạng thái
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={type} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="shipping">Đang vận chuyển</TabsTrigger>
              <TabsTrigger value="success">Hoàn tất</TabsTrigger>
              <TabsTrigger value="canceled">Đã huỷ</TabsTrigger>
              <TabsTrigger value="refunded">Hoàn trả</TabsTrigger>
            </TabsList>

            {/* === ALL === */}
            <TabsContent value="all" className="space-y-4">
              {total === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Chưa có đơn bán
                </div>
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

            <TabsContent value="refunded" className="space-y-4">
              {refundedOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn hoàn trả</div>
              ) : (
                refundedOrders.map(renderRefundCard)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Modal xác nhận giao hàng */}
      <DeliveryProofModal
        open={proofModal.open}
        order={proofModal.order}
        onClose={() => setProofModal({ open: false, order: null })}
        onSubmit={submitDelivered}
      />
    </>
  )
}

export default SalesSection
