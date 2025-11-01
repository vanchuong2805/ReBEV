import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { getOrderBySeller, changeOrderStatus } from '@/features/profile/service'


import PendingSaleCard from '@/features/profile/components/sales/PendingSaleCard'
import ProcessingSaleCard from '@/features/profile/components/sales/ProcessingSaleCard'
import ShippingSaleCard from '@/features/profile/components/sales/ShippingSaleCard'
import SuccessSaleCard from '@/features/profile/components/sales/SuccessSaleCard'
import CanceledSaleCard from '@/features/profile/components/sales/CanceledSaleCard'

const SalesSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"
  const handleTabChange = (value) => setSearchParams({ type: value })

  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const { user } = useUser()

  // 🧩 Lấy trạng thái mới nhất
  const getStatus = (order) => order.order_statuses?.at(-1)?.status || ""

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const data = await getOrderBySeller(user.id)
        console.log("Đơn bán tải về:", data)
        setOrders(data || [])
      } catch (error) {
        console.error("❌ Lỗi tải đơn bán:", error)
      }
    }
    fetchOrders()
  }, [user])

  const pendingOrders = orders.filter(o => getStatus(o) === 'PAID')
  const processingOrders = orders.filter(o => getStatus(o) === 'CONFIRMED')
  const shippingOrders = orders.filter(o => getStatus(o) === 'DELIVERING')
  const successOrders = orders.filter(o => getStatus(o) === 'COMPLETED')
  const canceledOrders = orders.filter(o => getStatus(o) === 'SELLER_CANCELLED' || getStatus(o) === 'FAIL_PAY')
  const total = orders.length

  const handleView = (order) => {
    navigate(`/profile/sale/${order.id}`, {
      state: { from: `/profile/sales?type=${type}` },
    })
  }

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
  const renderSaleCard = (order) => {
  const s = getStatus(order)

  const renderDetails = (CardComponent, extraProps = {}) =>
    order.order_details.map((detail) => (
      <CardComponent
        key={detail.id}
        sale={detail.post}
        onView={() => handleView(order)}
        {...extraProps}
      />
    ))
  return (
    <div key={order.id} className="border border-gray-300 rounded-md p-4 mb-4">
      <h3 className="font-semibold mb-2">Đơn hàng #{order.id}</h3>

      {s === "PAID" && renderDetails(PendingSaleCard, { onAccept: () => handleAccept(order) })}
      {s === "CONFIRMED" && renderDetails(ProcessingSaleCard)}
      {s === "DELIVERING" && renderDetails(ShippingSaleCard)}
      {s === "COMPLETED" && renderDetails(SuccessSaleCard)}
      {(s === "SELLER_CANCELLED" || s === "FAIL_PAY") &&
        renderDetails(CanceledSaleCard, { onAccept: () => handleAccept(order) })}
    </div>
  )
}


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Đơn bán của tôi</CardTitle>
            <CardDescription>Quản lý tất cả đơn bán theo trạng thái</CardDescription>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Car className="w-4 h-4 mr-2" />
            Đăng tin mới
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={type} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all" className="text-sm">Tất cả ({total})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ xác nhận ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="processing" className="text-sm">Đang xử lý ({processingOrders.length})</TabsTrigger>
            <TabsTrigger value="shipping" className="text-sm">Đang vận chuyển ({shippingOrders.length})</TabsTrigger>
            <TabsTrigger value="success" className="text-sm">Hoàn tất ({successOrders.length})</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Đã huỷ ({canceledOrders.length})</TabsTrigger>
          </TabsList>

          {/* === Tất cả === */}
          <TabsContent value="all" className="space-y-4">
            {total === 0
              ? <div className="text-center py-12 text-gray-500">Chưa có đơn bán</div>
              : orders.map(renderSaleCard)
            }
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0
              ? <div className="text-gray-500">Không có đơn chờ xác nhận</div>
              : pendingOrders.map(renderSaleCard)
            }
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {processingOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đang xử lý</div>
              : processingOrders.map(renderSaleCard)
            }
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {shippingOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đang vận chuyển</div>
              : shippingOrders.map(renderSaleCard)
            }
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            {successOrders.length === 0
              ? <div className="text-gray-500">Không có đơn hoàn tất</div>
              : successOrders.map(renderSaleCard)
            }
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {canceledOrders.length === 0
              ? <div className="text-gray-500">Không có đơn đã huỷ</div>
              : canceledOrders.map(renderSaleCard)
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default SalesSection
