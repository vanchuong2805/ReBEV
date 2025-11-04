import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { getOrderById, getPostById, getUserById } from "../../service"
import OrderLayout from "./components/OrderLayout"
import OrderProgress from "./components/OrderProgress"
import OrderAddress from "./components/OrderAddress"
import OrderTimeline from "./components/OrderTimeline"
import OrderProductList from "./components/OrderProductList"
import OrderSummary from "./components/OrderSummary"

export default function ReturnOrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await getOrderById(orderId)
      setOrder(data)
      const postData = await Promise.all(
        data.order_details.map(async (d) => {
          const p = await getPostById(d.post_id)
          const u = await getUserById(p.user_id)
          return { ...p, seller: u }
        })
      )
      setPosts(postData)
    }
    fetchData()
  }, [orderId])

  if (!order) return <div className="text-center py-20 text-gray-500">Đang tải...</div>

  const latest = order.order_statuses?.at(-1)?.status || "PAID"
  const canceled = ["CANCELLED", "CUSTOMER_CANCELLED", "SELLER_CANCELLED"].includes(latest)
  const toContact = JSON.parse(order.to_contact || "{}")
  const timeline = order.order_statuses || []
  const progress = ["PAID", "CONFIRMED", "DELIVERING", "COMPLETED"].indexOf(latest)

  return (
    <OrderLayout
      title={`HOÀN TIỀN - MÃ ĐƠN: ${order.id}`}
      status={latest}
      onBack={() => navigate(-1)}
    >
      <Card className="p-8 bg-white shadow-sm">
        <OrderProgress progressIndex={progress} isCanceled={canceled} />
      </Card>

      <Card className="p-6 bg-white">
        <div className="grid grid-cols-2 gap-8">
          <OrderAddress toContact={toContact} />
          <OrderTimeline timeline={timeline} isCanceled={canceled} />
        </div>
      </Card>

      <OrderProductList posts={posts} order={order} navigate={navigate} type="refund" />
      <OrderSummary order={order} showRefund />
    </OrderLayout>
  )
}
