import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { getOrderById, getPostById, getUserById } from "../../service"

// === Các components tái sử dụng ===
import OrderLayout from "./OrderLayout"
import OrderProgress from "./OrderProgress"
import OrderAddress from "./OrderAddress"
import OrderTimeline from "./OrderTimeline"
import OrderProductList from "./OrderProductList"
import OrderSummary from "./OrderSummary"

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [posts, setPosts] = useState([])

  // === Gọi API lấy chi tiết đơn và sản phẩm ===
  useEffect(() => {
    async function fetchOrderAndPosts() {
      try {
        const data = await getOrderById(orderId)
        console.log("✅ Dữ liệu đơn hàng:", data)
        setOrder(data)

        const postIds = data?.order_details?.map((d) => d.post_id) || []

        if (postIds.length > 0) {
          const postDataList = await Promise.all(
            postIds.map(async (id) => {
              const postRes = await getPostById(id)
              const sellerRes = await getUserById(postRes.user_id)

              let thumbnailUrl = "/placeholder.png"
              try {
                const parsed =
                  typeof postRes.media === "string"
                    ? JSON.parse(postRes.media)
                    : postRes.media
                if (Array.isArray(parsed)) {
                  const thumb = parsed.find((item) => item.is_thumbnail)
                  thumbnailUrl =
                    thumb?.url?.replace(/^image\s+/i, "") || thumbnailUrl
                }
              } catch (e) {
                console.error("❌ Lỗi parse media:", e)
              }

              return {
                ...postRes,
                thumbnailUrl,
                seller: sellerRes
              }
            })
          )

          setPosts(postDataList)
          console.log(" Dữ liệu bài đăng:", order)
        }
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu đơn hàng:", err)
      }
    }

    fetchOrderAndPosts()
  }, [orderId])

  // === Nếu chưa tải xong ===
  if (!order)
    return (
      <div className="text-center py-20 text-gray-500">
        Đang tải đơn hàng...
      </div>
    )

  // === Xác định trạng thái đơn hàng ===
  const latestStatus = order.order_statuses?.at(-1)?.status || "PAID"
  const statusFlow = ["PAID", "CONFIRMED", "DELIVERING","DELIVERED", "COMPLETED"]

  const canceledStatuses = [
    "CANCELLED",
    "CUSTOMER_CANCELLED",
    "SELLER_CANCELLED",
    "FAIL_PAY"
  ]

  const statusMap = {
    PAID: "Chờ xác nhận",
    CONFIRMED: "Đang xử lý",
    DELIVERING: "Đang vận chuyển",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
    CUSTOMER_CANCELLED: "Đã hủy (người mua)",
    SELLER_CANCELLED: "Đã hủy (người bán)",
    FAIL_PAY: "Thanh toán thất bại"
  }

  const currentStatusVi = statusMap[latestStatus] || "Chờ xác nhận"
  const progressIndex = Math.max(statusFlow.indexOf(latestStatus), 0)
  const isCanceled = canceledStatuses.includes(latestStatus)

  // === Địa chỉ người nhận ===
  let toContact = {}
  try {
    toContact = JSON.parse(order.to_contact || "{}")
  } catch {
    toContact = {}
  }
  let fromContact = {}
  try {
    fromContact = JSON.parse(order.from_contact || "{}")
  } catch {
    fromContact = {}
  }

  // === Timeline trạng thái đơn ===
  const timeline =
    order.order_statuses
      ?.slice()
      ?.sort((a, b) => new Date(b.create_at) - new Date(a.create_at)) || []

  // === Render ===
  return (
    <OrderLayout
      title={`MÃ ĐƠN HÀNG: ${order.id}`}
      status={currentStatusVi}
      onBack={() => navigate(-1)}
    >
      {/* === Thanh tiến trình === */}
      <Card className="p-8 bg-white shadow-sm">
        <OrderProgress progressIndex={progressIndex} isCanceled={isCanceled} type="normal" />
      </Card>

      {/* === Địa chỉ + Timeline === */}
      <Card className="p-6 bg-white">
        <div className="grid grid-cols-2 gap-8">
          <OrderAddress toContact={toContact} fromContact={fromContact} type={order.type} />
          <OrderTimeline timeline={timeline} isCanceled={isCanceled} />
        </div>
      </Card>

      {/* === Danh sách sản phẩm + Tổng tiền === */}
      <OrderProductList posts={posts} order={order} navigate={navigate} type="normal" />
      <OrderSummary order={order} />
    </OrderLayout>
  )
}
