import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card } from "@/components/ui/card"
import OrderLayout from "./OrderLayout"
import OrderProgress from "./OrderProgress"
import OrderProductList from "./OrderProductList"
import { XCircle, Ban, Clock } from "lucide-react"

export default function ReturnOrderDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts, setPosts] = useState([])

  // 🧩 Nhận order (pros item) từ PurchasesSection
  const order = location.state?.order

  // 🚫 Nếu reload mà không có dữ liệu
  if (!order) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không có dữ liệu đơn hoàn tiền. <br />
        Vui lòng quay lại trang "Đơn mua" để mở lại.
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  // 🧠 Xác định trạng thái khiếu nại
  const complaintStatus = order.complaint_status || 1
  const isApproved = complaintStatus === 1

  // 🧩 Lấy trạng thái đơn hoàn
  const latest = order.order_status?.at(-1)?.status || "PENDING"
  const canceled = ["CANCELLED", "CUSTOMER_CANCELLED", "SELLER_CANCELLED"].includes(latest)
  const returnStatuses = ["PENDING", "RETURNING", "RETURNED"]
  const progress = returnStatuses.indexOf(latest)

  // 🧩 Chuẩn hóa danh sách post và thêm thumbnail
  useEffect(() => {
    const normalizePosts = () => {
      const rawPosts = Array.isArray(order.order_details)
        ? order.order_details.map((d) => d.post)
        : order.order_detail?.post
          ? [order.order_detail.post]
          : []

      const enriched = rawPosts.map((postRes) => {
        let thumbnailUrl = "/placeholder.png"
        try {
          const parsed =
            typeof postRes.media === "string"
              ? JSON.parse(postRes.media)
              : postRes.media

          if (Array.isArray(parsed)) {
            const thumb = parsed.find((item) => item.is_thumbnail) || parsed[0]
            thumbnailUrl = thumb?.url?.replace(/^image\s+/i, "") || thumbnailUrl
          }
        } catch (err) {
          console.warn(" Lỗi parse media:", err)
        }

        return {
          ...postRes,
          thumbnailUrl,
        }
      })

      setPosts(enriched)
    }

    normalizePosts()
  }, [order])

  // 🧱 UI
  return (
    <OrderLayout
      title={`HOÀN TIỀN - MÃ ĐƠN: ${order.id}`}
      status={latest}
      onBack={() => navigate(-1)}
    >
      <Card className="p-8 bg-white shadow-sm text-center">
        {complaintStatus === 0 && (
          <>
            <Clock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Yêu cầu hoàn tiền đang chờ duyệt
            </p>
            <p className="text-sm text-gray-500">
              Admin ReBEV đang xem xét yêu cầu hoàn tiền của bạn.
            </p>
          </>
        )}

        {complaintStatus === 1 && (
          <OrderProgress
            progressIndex={progress}
            isCanceled={canceled}
            type="return"
          />
        )}

        {complaintStatus === 2 && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-red-600 mb-2">
              Yêu cầu hoàn tiền bị từ chối
            </p>
            <p className="text-sm text-gray-500">
              Admin đã xem xét và từ chối yêu cầu hoàn tiền này.
            </p>
          </>
        )}

        {complaintStatus === 3 && (
          <>
            <Ban className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Bạn đã huỷ yêu cầu hoàn tiền
            </p>
            <p className="text-sm text-gray-500">
              Nếu đây là nhầm lẫn, bạn có thể gửi lại yêu cầu mới.
            </p>
          </>
        )}
      </Card>

      {/* Danh sách sản phẩm hoàn tiền */}
      <OrderProductList
        posts={posts}
        order={order}
        navigate={navigate}
        type="refund"
      />
    </OrderLayout>
  )
}
