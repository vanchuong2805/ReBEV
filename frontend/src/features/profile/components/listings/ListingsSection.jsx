// sections/ListingsSection.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'

import ListingCard from "./ListingCard"
import PendingListingCard from "./PendingListingCard"
import SoldListingCard from "./SoldListingCard"
import ExpiredListingCard from "./ExpiredListingCard"




const ListingsSection = ({ currentListings = [] }) => {
  const all = Array.isArray(currentListings) ? currentListings : []

  const activeListings  = all.filter(l => l.status === 'Đang bán')
  const pendingListings = all.filter(l => l.status === 'Chờ duyệt')
  const soldListings    = all.filter(l => l.status === 'Đã bán')
  const expiredListings = all.filter(l => l.status === 'Tin ẩn')
  const total = all.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý tin đăng</CardTitle>
            <CardDescription>Tất cả tin đăng xe và pin của bạn</CardDescription>
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
            <TabsTrigger value="active" className="text-sm">Đang bán ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ duyệt ({pendingListings.length})</TabsTrigger>
            <TabsTrigger value="sold" className="text-sm">Đã bán ({soldListings.length})</TabsTrigger>
            <TabsTrigger value="expired" className="text-sm">Tin ẩn ({expiredListings.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="text-sm">Bị từ chối (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {total === 0 && (
              <div className="text-center py-12 text-gray-500">Chưa có tin đăng</div>
            )}
            {activeListings.map(l => <ListingCard key={`a-${l.id}`} listing={l} />)}
            {pendingListings.map(l => <PendingListingCard key={`p-${l.id}`} listing={l} />)}
            {soldListings.map(l => <SoldListingCard key={`s-${l.id}`} listing={l} />)}
            {expiredListings.map(l => <ExpiredListingCard key={`e-${l.id}`} listing={l} />)}
          </TabsContent>

          <TabsContent value="active">
            <div className="space-y-4">
              {activeListings.length === 0 && <div className="text-gray-500">Không có tin đang bán</div>}
              {activeListings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingListings.length === 0 && <div className="text-gray-500">Không có tin chờ duyệt</div>}
              {pendingListings.map(l => <PendingListingCard key={l.id} listing={l} />)}
            </div>
          </TabsContent>

          <TabsContent value="sold">
            <div className="space-y-4">
              {soldListings.length === 0 && <div className="text-gray-500">Không có tin đã bán</div>}
              {soldListings.map(l => <SoldListingCard key={l.id} listing={l} />)}
            </div>
          </TabsContent>

          <TabsContent value="expired">
            <div className="space-y-4">
              {expiredListings.length === 0 && <div className="text-gray-500">Không có tin tin ẩn</div>}
              {expiredListings.map(l => <ExpiredListingCard key={l.id} listing={l} />)}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="text-center py-12">
              <div className="text-gray-500">Không có tin đăng bị từ chối</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
export default ListingsSection
