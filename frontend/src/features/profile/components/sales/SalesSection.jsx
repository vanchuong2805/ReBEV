import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'

import PendingSaleCard from '@/features/profile/components/sales/PendingSaleCard'
import ProcessingSaleCard from '@/features/profile/components/sales/ProcessingSaleCard'
import ShippingSaleCard from '@/features/profile/components/sales/ShippingSaleCard'
import SuccessSaleCard from '@/features/profile/components/sales/SuccessSaleCard'
import CanceledSaleCard from '@/features/profile/components/sales/CanceledSaleCard'

import { mockSales } from '@/features/profile/components/sales/MockSales'

const SalesSection = () => {
  const getStatus = (s) => (s?.status_vi || s?.status || '').trim()
  const all = Array.isArray(mockSales) ? mockSales : []

  const pending    = all.filter(x => getStatus(x) === 'Chờ xác nhận')
  const processing = all.filter(x => getStatus(x) === 'Đang xử lý')
  const shipping   = all.filter(x => getStatus(x) === 'Đang vận chuyển')
  const success    = all.filter(x => getStatus(x) === 'Hoàn tất')
  const canceled   = all.filter(x => getStatus(x) === 'Đã huỷ')

  const total = all.length

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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all" className="text-sm">Tất cả ({total})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ xác nhận ({pending.length})</TabsTrigger>
            <TabsTrigger value="processing" className="text-sm">Đang xử lý ({processing.length})</TabsTrigger>
            <TabsTrigger value="shipping" className="text-sm">Đang vận chuyển ({shipping.length})</TabsTrigger>
            <TabsTrigger value="success" className="text-sm">Hoàn tất ({success.length})</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Đã huỷ ({canceled.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {total === 0 && <div className="text-center py-12 text-gray-500">Chưa có đơn bán</div>}
            {all.map(o => {
              const s = getStatus(o)
              if (s === 'Chờ xác nhận')    return <PendingSaleCard    key={o.id} sale={o} />
              if (s === 'Đang xử lý')      return <ProcessingSaleCard key={o.id} sale={o} />
              if (s === 'Đang vận chuyển') return <ShippingSaleCard   key={o.id} sale={o} />
              if (s === 'Hoàn tất')        return <SuccessSaleCard    key={o.id} sale={o} />
              if (s === 'Đã huỷ')          return <CanceledSaleCard   key={o.id} sale={o} />
              return null
            })}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 && <div className="text-gray-500">Không có đơn chờ xác nhận</div>}
            {pending.map(o => <PendingSaleCard key={o.id} sale={o} />)}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {processing.length === 0 && <div className="text-gray-500">Không có đơn đang xử lý</div>}
            {processing.map(o => <ProcessingSaleCard key={o.id} sale={o} />)}
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {shipping.length === 0 && <div className="text-gray-500">Không có đơn đang vận chuyển</div>}
            {shipping.map(o => <ShippingSaleCard key={o.id} sale={o} />)}
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            {success.length === 0 && <div className="text-gray-500">Không có đơn hoàn tất</div>}
            {success.map(o => <SuccessSaleCard key={o.id} sale={o} />)}
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {canceled.length === 0 && <div className="text-gray-500">Không có đơn đã huỷ</div>}
            {canceled.map(o => <CanceledSaleCard key={o.id} sale={o} />)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default SalesSection
