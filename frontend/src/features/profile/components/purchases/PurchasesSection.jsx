import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


import PendingPurchaseCard from '@/features/profile/components/purchases/PendingPurchaseCard'
import ProcessingPurchaseCard from '@/features/profile/components/purchases/ProcessingPurchaseCard'
import ShippingPurchaseCard from '@/features/profile/components/purchases/ShippingPurchaseCard'
import SuccessPurchases from '@/features/profile/components/purchases/SuccessPurchases'
import CanceledPurchaseCard from '@/features/profile/components/purchases/CanceledPurchaseCard'
import RefundedPurchaseCard from '@/features/profile/components/purchases/RefundedPurchaseCard'

// dữ liệu giả (đảm bảo file MockPurchases.js export const mockPurchases = [...])
import { mockPurchases } from '@/features/profile/components/purchases/MockPurchases'

const PurchasesSection = () => {
  const getStatus = (o) => (o?.status_vi || o?.status || '').trim()
  const all = Array.isArray(mockPurchases) ? mockPurchases : []

  const pendingOrders    = all.filter(o => getStatus(o) === 'Chờ xác nhận')
  const processingOrders = all.filter(o => getStatus(o) === 'Đang xử lý')
  const shippingOrders   = all.filter(o => getStatus(o) === 'Đang vận chuyển')
  const successOrders    = all.filter(o => getStatus(o) === 'Hoàn tất')
  const canceledOrders   = all.filter(o => getStatus(o) === 'Đã huỷ')
  const refundedOrders   = all.filter(o => getStatus(o) === 'Đã hoàn tiền')
  const total = all.length
  const navigate = useNavigate()
  const handleView = (purchase) => {
     console.log('Đi đến:', purchase.id)
    navigate(`/profile/purchases/${purchase.id}`)
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-7">
            <TabsTrigger value="all" className="text-sm">Tất cả ({total})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ xác nhận ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="processing" className="text-sm">Đang xử lý ({processingOrders.length})</TabsTrigger>
            <TabsTrigger value="shipping" className="text-sm">Đang vận chuyển ({shippingOrders.length})</TabsTrigger>
            <TabsTrigger value="success" className="text-sm">Hoàn tất ({successOrders.length})</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Đã huỷ ({canceledOrders.length})</TabsTrigger>
            <TabsTrigger value="refunded" className="text-sm">Đã hoàn tiền ({refundedOrders.length})</TabsTrigger> 
          </TabsList>

          {/* All */}
          <TabsContent value="all" className="space-y-4">
            {total === 0 && <div className="text-center py-12 text-gray-500">Chưa có đơn mua</div>}
            {all.map(o => {
              const s = getStatus(o)
              if (s === 'Chờ xác nhận')   return <PendingPurchaseCard    key={o.id} purchase={o} onView={() => handleView(o)}/>
              if (s === 'Đang xử lý')     return <ProcessingPurchaseCard key={o.id} purchase={o} onView={() => handleView(o)}/>
              if (s === 'Đang vận chuyển')return <ShippingPurchaseCard   key={o.id} purchase={o} onView={() => handleView(o)}/>
              if (s === 'Hoàn tất')       return <SuccessPurchases       key={o.id} purchase={o} onView={() => handleView(o)}/>
              if (s === 'Đã huỷ')         return <CanceledPurchaseCard   key={o.id} purchase={o} onView={() => handleView(o)}/>
              if (s === 'Đã hoàn tiền')   return <RefundedPurchaseCard   key={o.id} purchase={o} onView={() => handleView(o)}/>
              return null
            })}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0 && <div className="text-gray-500">Không có đơn chờ xác nhận</div>}
            {pendingOrders.map(o => <PendingPurchaseCard key={o.id} purchase={o} onView={() => handleView(o)} />)}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {processingOrders.length === 0 && <div className="text-gray-500">Không có đơn đang xử lý</div>}
            {processingOrders.map(o => <ProcessingPurchaseCard key={o.id} purchase={o} onView={() => handleView(o)} />)}
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {shippingOrders.length === 0 && <div className="text-gray-500">Không có đơn đang vận chuyển</div>}
            {shippingOrders.map(o => <ShippingPurchaseCard key={o.id} purchase={o} onView={() => handleView(o)} />)}
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            {successOrders.length === 0 && <div className="text-gray-500">Không có đơn hoàn tất</div>}
            {successOrders.map(o => <SuccessPurchases key={o.id} purchase={o} onView={() => handleView(o)} />)}
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {canceledOrders.length === 0 && <div className="text-gray-500">Không có đơn đã huỷ</div>}
            {canceledOrders.map(o => <CanceledPurchaseCard key={o.id} purchase={o} onView={() => handleView(o)} />)}
          </TabsContent>
          <TabsContent value="refunded" className="space-y-4">
            {refundedOrders.length === 0 && <div className="text-gray-500">Không có đơn đã hoàn tiền</div>}
            {refundedOrders.map(o => <RefundedPurchaseCard key={o.id} purchase={o} onView={() => handleView(o)} />)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default PurchasesSection
