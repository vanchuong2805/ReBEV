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
import CanceledListingCard from './CanceledListingCard'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPostsByUserId, updatePostVisibility } from '../../service'
import { useUser } from "@/contexts/UserContext"


const ListingsSection = () => {
  const [listings, setListings] = useState([])
  const { user } = useUser()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (!user?.id) return
        const data = await getPostsByUserId(user.id)
        console.log('✅ Tin đăng đã tải:', data)
        setListings(data)
      } catch (error) {
        console.error('❌ Lỗi tải tin đăng:', error)
      }
    }

    fetchListings()
  }, [user])

  const activeListings = listings.filter(l => (Number(l?.status) === 1 || Number(l?.status) === 7) && l?.is_hidden === false)
  const pendingListings = listings.filter(l => Number(l?.status) === 0 && l?.is_hidden === false)
  const soldListings = listings.filter(l => Number(l?.status) === 3 && l?.is_hidden === false)
  const expiredListings = listings.filter(l => Number(l?.status) === 1 && l?.is_hidden === true)
  const rejectedListings = listings.filter(l => Number(l?.status) === 2)
  const canceledListings = listings.filter(l => Number(l?.status) === 5)

 const total = listings.length
  const navigate = useNavigate()
  const handleViewDetail = (listing) => {
    console.log('Đi đến:', listing.id)
    navigate(`/marketplace/listing/${listing.id}`, {
      state: { from: `/profile/listings?type=${type}` }
    })
  }
  const handleHideListing = async (listingId) => {
    try {
      await updatePostVisibility(listingId)
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === listingId
            ? { ...listing, is_hidden: !listing.is_hidden }
            : listing
        )
      )
      console.log(" Ẩn tin thành công:", listingId)
    } catch (error) {
      console.error(" Lỗi ẩn tin đăng:", error)
    }
  }

  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") || "all"

  const handleTabChange = (value) => {
    setSearchParams({ type: value })
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
        <Tabs value={type} onValueChange={handleTabChange} className="w-full">
          {/* 🔹 Thêm 1 cột cho tab Tin huỷ (tổng 7 tab) */}
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="all" className="text-sm">Tất cả ({total})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Chờ duyệt ({pendingListings.length})</TabsTrigger>
            <TabsTrigger value="active" className="text-sm">Đang bán ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="sold" className="text-sm">Đã bán ({soldListings.length})</TabsTrigger>
            <TabsTrigger value="expired" className="text-sm">Tin ẩn ({expiredListings.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="text-sm">Bị từ chối ({rejectedListings.length})</TabsTrigger>
            <TabsTrigger value="canceled" className="text-sm">Tin huỷ ({canceledListings.length})</TabsTrigger>
          </TabsList>

          {/* === ALL === */}
          <TabsContent value="all" className="space-y-4">
            {total === 0 && <div className="text-center py-12 text-gray-500">Chưa có tin đăng</div>}
            {pendingListings.map(l => <PendingListingCard key={`p-${l.id}`} listing={l} onView={() => handleViewDetail(l)} />)}
            {activeListings.map(l => <ListingCard key={`a-${l.id}`} listing={l} onView={() => handleViewDetail(l)} onHide={() => handleHideListing(l.id)} />)}
            {soldListings.map(l => <SoldListingCard key={`s-${l.id}`} listing={l} onView={() => handleViewDetail(l)} />)}
            {expiredListings.map(l => <ExpiredListingCard key={`e-${l.id}`} listing={l} onView={() => handleViewDetail(l)} onHide={() => handleHideListing(l.id)} />)}
            {rejectedListings.map(l => <RejectedListingCard key={`r-${l.id}`} listing={l} onView={() => handleViewDetail(l)} />)}
            {canceledListings.map(l => <CanceledListingCard key={`c-${l.id}`} listing={l} onView={() => handleViewDetail(l)} />)}
          </TabsContent>

          {/* === PENDING === */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingListings.length === 0 && <div className="text-gray-500">Không có tin chờ duyệt</div>}
              {pendingListings.map(l => <PendingListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)} />)}
            </div>
          </TabsContent>

          {/* === ACTIVE === */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeListings.length === 0 && <div className="text-gray-500">Không có tin đang bán</div>}
              {activeListings.map(l => <ListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)} onHide={() => handleHideListing(l.id)} />)}
            </div>
          </TabsContent>

          {/* === SOLD === */}
          <TabsContent value="sold">
            <div className="space-y-4">
              {soldListings.length === 0 && <div className="text-gray-500">Không có tin đã bán</div>}
              {soldListings.map(l => <SoldListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)} onHide={() => handleHideListing(l.id)} />)}
            </div>
          </TabsContent>

          {/* === EXPIRED === */}
          <TabsContent value="expired">
            <div className="space-y-4">
              {expiredListings.length === 0 && <div className="text-gray-500">Không có tin tin ẩn</div>}
              {expiredListings.map(l => <ExpiredListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)} onHide={handleHideListing} />)}
            </div>
          </TabsContent>

          {/* === REJECTED === */}
          <TabsContent value="rejected">
            <div className="space-y-4">
              {rejectedListings.length === 0 && <div className="text-gray-500">Không có tin đăng bị từ chối</div>}
              {rejectedListings.map(l => <RejectedListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)} />)}
            </div>
          </TabsContent>

          {/* === CANCELED === ✅ mới */}
          <TabsContent value="canceled">
            <div className="space-y-4">
              {canceledListings.length === 0 && <div className="text-gray-500">Không có tin đã huỷ</div>}
              {canceledListings.map(l => <CanceledListingCard key={l.id} listing={l} onView={() => handleViewDetail(l)} />)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ListingsSection
