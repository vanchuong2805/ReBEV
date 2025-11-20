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

import ReviewModal from "@/features/profile/components/purchases/ReviewModal"
import ComplaintModal from "@/features/profile/components/purchases/ComplaintModal"
import PurchaseFooter from "./PurchaseFooter"
import PurchaseHeader from "./PurchaseHeader"
import GenericPurchaseCard from "../purchases/GenericPurchaseCard"
import { toast } from "sonner"

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

  const getStatus = (order) => {
    if (!order) return ""
    if (order.order_statuses?.length)
      return order.order_statuses.at(-1).status
    if (order.order_status?.length)
      return order.order_status.at(-1).status
    return ""
  }
  const fetchAllData = async () => {
    if (!user?.id) return
    try {
      const res = await getOrderByCustomer(user.id)
      const data = res.orders

      const complaintRes = await getComplaintByUserId(user.id)

      const withReviewed = await Promise.all(
        data.map(async (order) => {
          const reviewed = order.order_details.some(
            (detail) => detail.user_reviews?.length > 0
          )
          return { ...order, reviewed }
        })
      )
      console.log("Complaints:", complaintRes)
      setOrders(withReviewed)
      setComplaints(complaintRes)
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [user])


  const handleReview = (detail, reviewed) => {
    setSelectedOrder(detail)
    setReviewed(reviewed)
    setShowReview(true)
  }

  const handleComplaint = (detail) => {
    setSelectedOrder(detail)
    setShowComplaint(true)
  }

  const handleCancel = async (order) => {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn hàng này không?")) return
    try {
      await changeOrderStatus(order.id, "CANCELLED", "Người mua đã huỷ đơn hàng")
      toast.success("Đơn hàng đã được huỷ thành công!")
      fetchAllData()
    } catch (error) {
      console.error("Lỗi huỷ đơn:", error)
      toast.error("Huỷ đơn thất bại, vui lòng thử lại.")
    }
  }

  const handleComplete = async (order) => {
    if (!window.confirm("Bạn có chắc muốn hoàn tất đơn hàng này không?")) return
    try {
      await changeOrderStatus(order.id, "COMPLETED", "Người mua đã hoàn tất đơn hàng")
      toast.success("Đơn hàng đã hoàn tất!")
      fetchAllData()
    } catch (error) {
      console.error("Lỗi hoàn tất:", error)
      toast.error("Hoàn tất đơn thất bại.")
    }
  }

  const handleReturn = async (order) => {
    if (!window.confirm("Xác nhận bạn đã bàn giao hàng hoàn trả?")) return
    try {
      await changeOrderStatus(order.return_order_id, "RETURNING", "Người mua đã bàn giao hàng hoàn trả")
      toast.success("Cập nhật trạng thái hoàn trả thành công!")
      fetchAllData()
    } catch (error) {
      console.error("Lỗi khi cập nhật hoàn trả:", error)
      toast.error("Cập nhật trạng thái thất bại.")
    }
  }

  const handleUpdateAppointment = async (order, appointment_time) => {
    try {
      await updateAppointmentTim(order.id, appointment_time)
      toast.success("Cập nhật lịch hẹn thành công!")
      fetchAllData()
    } catch (err) {
      console.error("Lỗi lịch hẹn:", err)
      toast.error("Cập nhật lịch hẹn thất bại.")
    }
  }

  const handleView = (order) => {
    navigate(`/profile/purchases/${order.id}`, {
      state: { from: `/profile/purchases?type=${type}` },
    })
  }

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
              key={detail.id}
              detail={detail}
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
          onUpdateAppointment={handleUpdateAppointment}
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
          <CardTitle>Đơn mua của tôi</CardTitle>
          <CardDescription>Quản lý tất cả đơn mua theo trạng thái</CardDescription>
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

            {/* ALL */}
            <TabsContent value="all" className="space-y-4">
              {total === 0 ? (
                <div className="text-center py-12 text-gray-500">Chưa có đơn mua</div>
              ) : (
                orders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* PENDING */}
            <TabsContent value="pending" className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn chờ xác nhận</div>
              ) : (
                pendingOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* PROCESSING */}
            <TabsContent value="processing" className="space-y-4">
              {processingOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn đang xử lý</div>
              ) : (
                processingOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* SHIPPING */}
            <TabsContent value="shipping" className="space-y-4">
              {shippingOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn đang vận chuyển</div>
              ) : (
                shippingOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* SUCCESS */}
            <TabsContent value="success" className="space-y-4">
              {successOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn hoàn tất</div>
              ) : (
                successOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* CANCELED */}
            <TabsContent value="canceled" className="space-y-4">
              {canceledOrders.length === 0 ? (
                <div className="text-gray-500">Không có đơn đã huỷ</div>
              ) : (
                canceledOrders.map(renderPurchaseCard)
              )}
            </TabsContent>

            {/* REFUNDED */}
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
                      <GenericPurchaseCard
                        type="refunded"
                        order={item}
                        status={status}
                        post={item.order_detail?.post || { title: "Không rõ sản phẩm" }}
                        cstatus={item.complaint_status}
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

      {/* REVIEW MODAL */}
      <ReviewModal
        reviewed={reviewed}
        open={showReview}
        onClose={() => setShowReview(false)}
        detail={selectedOrder}
        onSubmit={() => {
          setShowReview(false)
          fetchAllData()
        }}
      />

      {/* COMPLAINT MODAL */}
      <ComplaintModal
        open={showComplaint}
        onClose={() => setShowComplaint(false)}
        detail={selectedOrder}
        onSubmitComplaint={async () => {
          setShowComplaint(false)
          await fetchAllData()
          toast.success("Tạo khiếu nại thành công!")
        }}
      />
    </>
  )
}

export default PurchasesSection
