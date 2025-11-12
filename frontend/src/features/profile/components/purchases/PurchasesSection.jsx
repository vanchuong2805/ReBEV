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
  getOrderByCustomer,
  changeOrderStatus,
  getComplaintByUserId,
  updateAppointmentTim,
} from "@/features/profile/service"

import ReviewModal from "@/features/profile/components/ReviewModal"
import ComplaintModal from "@/features/profile/components/purchases/ComplaintModal"
import PurchaseFooter from "./PurchaseFooter"
import PurchaseHeader from "./PurchaseHeader"
import GenericPurchaseCard from "../purchases/GenericPurchaseCard"

const PurchasesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const [showComplaint, setShowComplaint] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [reviewed, setReviewed] = useState(false)

  const navigate = useNavigate()
  const { user } = useUser()

  // ✅ Hàm lấy trạng thái hoạt động cho cả đơn hàng thường và đơn hoàn
  const getStatus = (order) => {
    if (!order) return ""
    if (order.order_statuses?.length)
      return order.order_statuses.at(-1).status
    if (order.order_status?.length)
      return order.order_status.at(-1).status
    return ""
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const res = await getOrderByCustomer(user.id)
        const data = res.orders
        const res1 = await getComplaintByUserId(user.id)

        const withReviewed = await Promise.all(
          data.map(async (order) => {
            const reviewed = order.order_details.some(
              (detail) =>
                detail.user_reviews && detail.user_reviews.length > 0
            )
            return { ...order, reviewed }
          })
        )

        setOrders(withReviewed)
        setComplaints(res1)
        console.log("Đơn hàng đã tải:", withReviewed)
        console.log("Khiếu nại đã tải:", res1)
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleReview = (purchase, reviewed) => {
    setSelectedOrder(purchase)
    setShowReview(true)
    setReviewed(reviewed)
  }

  const handleComplaint = (purchase) => {
    setSelectedOrder(purchase)
    setShowComplaint(true)
  }

  const handleCancel = async (order) => {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn hàng này không?")) return
    try {
      await changeOrderStatus(order.id, "CANCELLED", "Người mua đã huỷ đơn hàng")
      setOrders((prev) =>
        prev.map((o) =>
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

  const handleComplete = async (order) => {
    if (!window.confirm("Bạn có chắc muốn hoàn tất đơn hàng này không?")) return
    try {
      await changeOrderStatus(order.id, "COMPLETED", "Người mua đã hoàn tất đơn hàng")
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, order_statuses: [...o.order_statuses, { status: "COMPLETED" }] }
            : o
        )
      )
      alert("Đơn hàng đã hoàn tất thành công!")
    } catch (error) {
      console.error("Lỗi khi hoàn tất đơn:", error)
      alert("Hoàn tất đơn thất bại, vui lòng thử lại.")
    }
  }

  // ✅ Cập nhật đúng logic bàn giao hàng hoàn trả
  const handleReturn = async (order) => {
    if (!window.confirm("Xác nhận bạn đã bàn giao hàng hoàn trả?")) return
    try {
      await changeOrderStatus(order.return_order_id, "RETURNING", "Người mua đã bàn giao hàng hoàn trả")
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === order.order_detail_id
            ? { ...c, order_status: [...c.order_status, { status: "RETURNING" }] }
            : c
        )
      )
      console.log("Đơn hoàn trả đã cập nhật:", order.order_detail_id)
      alert("Trạng thái đơn đã cập nhật sang 'Đang bàn giao hàng'.")
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hoàn trả:", error)
      alert("Cập nhật trạng thái thất bại, vui lòng thử lại.")
    }
  }

  const handleUpdateAppointmente = async (order, appointment_time) => {
    try {
      await updateAppointmentTim(order.id, appointment_time)
      alert("Cập nhật lịch hẹn thành công!")

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                order_details: o.order_details.map((d) => ({
                  ...d,
                  appointment_time,
                })),
              }
            : o
        )
      )
    } catch (err) {
      console.error("Lỗi cập nhật lịch hẹn:", err)
      alert("Cập nhật lịch hẹn thất bại.")
    }
  }

  const handleView = (order) => {
    navigate(`/profile/purchases/${order.id}`, {
      state: { from: `/profile/purchases?type=${type}` },
    })
  }

  // === Nhóm đơn hàng theo trạng thái ===
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

  const refundedOrders = complaints
  const total = orders.length

  const renderPurchaseCard = (order) => {
    const status = getStatus(order)

    return (
      <div
        key={order.id}
        className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
      >
        <PurchaseHeader order={order} seller={order.seller} />

        {order.order_details.map((detail) => {
          const product = detail.post
          return (
            <GenericPurchaseCard
              detail={detail}
              key={detail.id}
              post={product}
              status={status}
              reviewed={order.reviewed}
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
              onComplaint={handleComplaint}
              onReview={handleReview}
              onView={() => handleView(order)}
            />
          )
        })}

        <PurchaseFooter
          order={order}
          status={status}
          onCancel={handleCancel}
          onComplete={handleComplete}
          onView={handleView}
          onUpdateAppointment={handleUpdateAppointmente}
        />
      </div>
    )
  }

  if (loading)
    return (
      <div className="text-center py-16 text-gray-500">
        Đang tải danh sách đơn mua...
      </div>
    )

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
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="shipping">Đang vận chuyển</TabsTrigger>
              <TabsTrigger value="success">Hoàn tất</TabsTrigger>
              <TabsTrigger value="canceled">Đã huỷ</TabsTrigger>
              <TabsTrigger value="refunded">Hoàn trả</TabsTrigger>
            </TabsList>

            {/* === Các tab trạng thái === */}
            <TabsContent value="all" className="space-y-4">
              {total === 0 ? (
                <div className="text-center py-12 text-gray-500">Chưa có đơn mua</div>
              ) : (
                orders.map(renderPurchaseCard)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn chờ xác nhận</div>
              ) : (
                pendingOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              {processingOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn đang xử lý</div>
              ) : (
                processingOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              {shippingOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn đang vận chuyển</div>
              ) : (
                shippingOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            <TabsContent value="success" className="space-y-4">
              {successOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn hoàn tất</div>
              ) : (
                successOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            <TabsContent value="canceled" className="space-y-4">
              {canceledOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn đã huỷ</div>
              ) : (
                canceledOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* ✅ Tab Hoàn trả - hiển thị đúng 3 trạng thái */}
            <TabsContent value="refunded" className="space-y-4">
              {refundedOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn hoàn trả</div>
              ) : (
                refundedOrders.map((item) => {
                  const status = getStatus(item)
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
                    >
                      <PurchaseHeader order={item} seller={item.seller} />

                      <p className="text-sm text-gray-600 mb-2 ml-1">
                        Trạng thái hoàn hàng:{" "}
                        <span className="font-medium text-gray-800">
                          {status === "PENDING"
                            ? "Chờ bàn giao hàng"
                            : status === "RETURNING"
                            ? "Đang bàn giao hàng"
                            : status === "RETURNED"
                            ? "Đã hoàn hàng"
                            : "Không rõ"}
                        </span>
                      </p>

                      <GenericPurchaseCard
                        type="refunded"
                        order={item}
                        post={item.order_detail?.post || { title: "Không rõ sản phẩm" }}
                        onView={() =>
                          navigate(`/profile/returns/${item.order_detail?.order_id}`, {
                            state: { order: item },
                          })
                        }
                      />

                      <PurchaseFooter
                        order={item}
                        price={item.order_detail?.price}
                        status={status}
                        onReturn={handleReturn}
                        onView={() =>
                          navigate(`/profile/returns/${item.order_detail?.order_id}`, {
                            state: { order: item },
                          })
                        }
                      />
                    </div>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ReviewModal
        reviewed={reviewed}
        open={showReview}
        onClose={() => setShowReview(false)}
        purchase={selectedOrder}
        onSubmit={() => setShowReview(false)}
      />

      <ComplaintModal
        open={showComplaint}
        onClose={() => setShowComplaint(false)}
        purchase={selectedOrder}
        onSubmitComplaint={() => {
          setShowComplaint(false)
          setOrders((prev) =>
            prev.map((o) =>
              o.order_details.some((d) => d.id === selectedOrder.id)
                ? {
                    ...o,
                    order_details: o.order_details.map((d) =>
                      d.id === selectedOrder.id
                        ? { ...d, complaints: [{ id: Date.now() }] }
                        : d
                    ),
                  }
                : o
            )
          )
        }}
      />
    </>
  )
}

export default PurchasesSection
