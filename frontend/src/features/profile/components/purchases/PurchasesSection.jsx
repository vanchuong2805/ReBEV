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

const PurchasesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const { user } = useUser()

  // 🧩 Hàm lấy trạng thái mới nhất của đơn hàng
  const getStatus = (order) => order.order_statuses?.at(-1)?.status || ""

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const data = await getOrderByCustomer(user.id)
        setOrders(data || [])
      } catch (error) {
        console.error("❌ Lỗi tải đơn hàng:", error)
      }
    }
    fetchOrders()
  }, [user])

  // 🧮 Gom đơn hàng theo trạng thái
  const pendingOrders    = orders.filter(o => getStatus(o) === 'PAID')
  const processingOrders = orders.filter(o => getStatus(o) === 'CONFIRMED')
  const shippingOrders   = orders.filter(o => getStatus(o) === 'DELIVERING')
  const successOrders    = orders.filter(o => getStatus(o) === 'COMPLETED')
  const canceledOrders   = orders.filter(o => getStatus(o) === 'CANCELLED')
  const refundedOrders   = orders.filter(o => getStatus(o) === 'Đã hoàn tiền')
  const total = orders.length

  const handleView = (order) => {
    navigate(`/profile/purchases/${order.id}`, {
      state: { from: `/profile/purchases?type=${type}` },
    })
  }

  // 🧾 Hàm chọn component card theo trạng thái
  const renderPurchaseCard = (order) => {
    const s = getStatus(order)
    if (s === 'PAID')          return <PendingPurchaseCard key={order.id} purchase={order.order_details?.[0]?.post} onView={() => handleView(order)} />
    if (s === 'CONFIRMED')     return <ProcessingPurchaseCard key={order.id} purchase={order.order_details?.[0]?.post} onView={() => handleView(order)} />
    if (s === 'DELIVERING')    return <ShippingPurchaseCard key={order.id} purchase={order.order_details?.[0]?.post} onView={() => handleView(order)} />
    if (s === 'COMPLETED')     return <SuccessPurchases key={order.id} purchase={order.order_details?.[0]?.post} onView={() => handleView(order)} />
    if (s === 'CANCELLED')     return <CanceledPurchaseCard key={order.id} purchase={order.order_details?.[0]?.post} onView={() => handleView(order)} />
    if (s === 'Đã hoàn tiền')  return <RefundedPurchaseCard key={order.id} purchase={order.order_details?.[0]?.post} onView={() => handleView(order)} />
    return null
  }

  return (
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
            <TabsTrigger value="all" className="text-sm">Tất cả ({total})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ xác nhận ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="processing" className="text-sm">Đang xử lý ({processingOrders.length})</TabsTrigger>
            <TabsTrigger value="shipping" className="text-sm">Đang vận chuyển ({shippingOrders.length})</TabsTrigger>
            <TabsTrigger value="success" className="text-sm">Hoàn tất ({successOrders.length})</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Đã huỷ ({canceledOrders.length})</TabsTrigger>
            <TabsTrigger value="refunded" className="text-sm">Đã hoàn tiền ({refundedOrders.length})</TabsTrigger>
          </TabsList>

          {/* Tất cả đơn */}
          <TabsContent value="all" className="space-y-4">
            {total === 0
              ? <div className="text-center py-12 text-gray-500">Chưa có đơn mua</div>
              : orders.map(renderPurchaseCard)
            }
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0
              ? <div className="text-gray-500">Không có đơn chờ xác nhận</div>
              : pendingOrders.map(renderPurchaseCard)
            }
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {processingOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đang xử lý</div>
              : processingOrders.map(renderPurchaseCard)
            }
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {shippingOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đang vận chuyển</div>
              : shippingOrders.map(renderPurchaseCard)
            }
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            {successOrders.length === 0
              ? <div className="text-gray-500">Không có đơn hoàn tất</div>
              : successOrders.map(renderPurchaseCard)
            }
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {canceledOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đã huỷ</div>
              : canceledOrders.map(renderPurchaseCard)
            }
          </TabsContent>

          <TabsContent value="refunded" className="space-y-4">
            {refundedOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đã hoàn tiền</div>
              : refundedOrders.map(renderPurchaseCard)
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default PurchasesSection
