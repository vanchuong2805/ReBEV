// sections/ListingsSection.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import ListingCard from './ListingCard'
import PendingListingCard from './PendingListingCard'
import SoldListingCard from './SoldListingCard'
import ExpiredListingCard from './ExpiredListingCard'
import RejectedListingCard from './RejectedListingCard'
import CanceledListingCard from './CanceledListingCard' // 🔹 thêm

import { mockListings } from './MockListings'

const ListingsSection = () => {
  const getStatus = (l) => (l?.current_status || l?.status || '').trim()
  const all = Array.isArray(mockListings) ? mockListings : []

  const activeListings = all.filter(l => getStatus(l) === 'Đang bán')
  const pendingListings = all.filter(l => getStatus(l) === 'Chờ duyệt')
  const soldListings = all.filter(l => getStatus(l) === 'Đã bán')
  const expiredListings = all.filter(l => ['Tin ẩn', 'Hết hạn'].includes(getStatus(l)))
  const rejectedListings = all.filter(l => getStatus(l) === 'Bị từ chối')
  const canceledListings = all.filter(l => getStatus(l) === 'Tin huỷ') // ✅ thêm filter

  const total = all.length
  const navigate = useNavigate()
   const handleViewDetail = (listing) => {
     console.log('Đi đến:', listing.id)
    navigate(`/marketplace/listing/${listing.id}`, {
      state: { from: "/profile/listings" }
    })
  }

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
          {/* 🔹 Thêm 1 cột cho tab Tin huỷ (tổng 7 tab) */}
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="all" className="text-sm">Tất cả ({total})</TabsTrigger>
            <TabsTrigger value="active" className="text-sm">Đang bán ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ duyệt ({pendingListings.length})</TabsTrigger>
            <TabsTrigger value="sold" className="text-sm">Đã bán ({soldListings.length})</TabsTrigger>
            <TabsTrigger value="expired" className="text-sm">Tin ẩn ({expiredListings.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="text-sm">Bị từ chối ({rejectedListings.length})</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Tin huỷ ({canceledListings.length})</TabsTrigger> {/* ✅ mới */}
          </TabsList>

          {/* === ALL === */}
          <TabsContent value="all" className="space-y-4">
            {total === 0 && <div className="text-center py-12 text-gray-500">Chưa có tin đăng</div>}
            {activeListings.map(l => <ListingCard key={`a-${l.id}`} listing={l} onView={() => handleViewDetail(l)}/>)}
            {pendingListings.map(l => <PendingListingCard key={`p-${l.id}`} listing={l} onView={() => handleViewDetail(l)}/>)}
            {soldListings.map(l => <SoldListingCard key={`s-${l.id}`} listing={l} onView={() => handleViewDetail(l)}/>)}
            {expiredListings.map(l => <ExpiredListingCard key={`e-${l.id}`} listing={l} onView={() => handleViewDetail(l)}/>)}
            {rejectedListings.map(l => <RejectedListingCard key={`r-${l.id}`} listing={l} onView={() => handleViewDetail(l)}/>)}
            {canceledListings.map(l => <CanceledListingCard key={`c-${l.id}`} listing={l} onView={() => handleViewDetail(l)}/>)}
          </TabsContent>

          {/* === ACTIVE === */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeListings.length === 0 && <div className="text-gray-500">Không có tin đang bán</div>}
              {activeListings.map(l => <ListingCard key={l.id} listing={l} onView={handleViewDetail}/>)}
            </div>
          </TabsContent>

          {/* === PENDING === */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingListings.length === 0 && <div className="text-gray-500">Không có tin chờ duyệt</div>}
              {pendingListings.map(l => <PendingListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)}/>)}
            </div>
          </TabsContent>

          {/* === SOLD === */}
          <TabsContent value="sold">
            <div className="space-y-4">
              {soldListings.length === 0 && <div className="text-gray-500">Không có tin đã bán</div>}
              {soldListings.map(l => <SoldListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)}/>)}
            </div>
          </TabsContent>

          {/* === EXPIRED === */}
          <TabsContent value="expired">
            <div className="space-y-4">
              {expiredListings.length === 0 && <div className="text-gray-500">Không có tin tin ẩn</div>}
              {expiredListings.map(l => <ExpiredListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)}/>)}
            </div>
          </TabsContent>

          {/* === REJECTED === */}
          <TabsContent value="rejected">
            <div className="space-y-4">
              {rejectedListings.length === 0 && <div className="text-gray-500">Không có tin đăng bị từ chối</div>}
              {rejectedListings.map(l => <RejectedListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)}/>)}
            </div>
          </TabsContent>

          {/* === CANCELED === ✅ mới */}
          <TabsContent value="canceled">
            <div className="space-y-4">
              {canceledListings.length === 0 && <div className="text-gray-500">Không có tin đã huỷ</div>}
              {canceledListings.map(l => <CanceledListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)}/>)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ListingsSection
