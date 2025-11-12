import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContext"
import {
    getPostsByUserId,
    changePostById,
    updatePostVisibility,
} from "../../service"
import EditListingModal from "./EditListingModal"
import GenericListingCard from "../listings/GenericListingCard"

const ListingsSection = () => {
    const [listings, setListings] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingListing, setEditingListing] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useUser()
    const navigate = useNavigate()

    const type = searchParams.get("type") || "all"

    useEffect(() => {
        const fetchListings = async () => {
            try {
                if (!user?.id) return
                const data = await getPostsByUserId(user.id)
                console.log(" Đã tải tin đăng:", data)
                setListings(data)
            } catch (error) {
                console.error(" Lỗi tải tin đăng:", error)
            }
        }
        fetchListings()
    }, [user])

    const activeListings = listings.filter(l => (Number(l?.status) === 1 || Number(l?.status) === 7) && l?.is_hidden === false)
    const pendingListings = listings.filter(l => Number(l?.status) === 0 && l?.is_hidden === false)
    const soldListings = listings.filter(l => Number(l?.status) === 3 && l?.is_hidden === false)
    const expiredListings = listings.filter(l => (Number(l?.status) === 1 || Number(l?.status) === 7) && l?.is_hidden === true)
    const rejectedListings = listings.filter(l => Number(l?.status) === 2)
    const canceledListings = listings.filter(l => Number(l?.status) === 5)

    const handleTabChange = (value) => setSearchParams({ type: value })

    const handleViewDetail = (listing) =>
        navigate(`/marketplace/listing/${listing.id}`, {
            state: { from: `/profile/listings?type=${type}` },
        })

    const handleHideListing = async (listingId) => {
        try {
            await updatePostVisibility(listingId)
            setListings((prev) =>
                prev.map((l) =>
                    l.id === listingId ? { ...l, is_hidden: !l.is_hidden } : l
                )
            )
        } catch (error) {
            console.error(" Lỗi ẩn tin:", error)
        }
    }

    const handleEditListing = (listing) => {
        setEditingListing(listing)
        setEditModalOpen(true)
    }

    const handleListingUpdated = (updatedPost) =>
        setListings((prev) =>
            prev.map((l) => (l.id === updatedPost.id ? updatedPost : l))
        )

    const handleCanceledListing = async (listingId) => {
        try {
            await changePostById(listingId, 5)
            setListings((prev) =>
                prev.map((l) => (l.id === listingId ? { ...l, status: 5 } : l))
            )
        } catch (error) {
            console.error(" Lỗi hủy tin đăng:", error)
        }
    }

    const total = listings.length

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Quản lý tin đăng</CardTitle>
                            <CardDescription>
                                Tất cả tin đăng xe và pin của bạn
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Tabs value={type} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-7 mb-6">
                            <TabsTrigger value="all">Tất cả</TabsTrigger>
                            <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                            <TabsTrigger value="active">Đang bán</TabsTrigger>
                            <TabsTrigger value="sold">Đã bán</TabsTrigger>
                            <TabsTrigger value="expired">Tin ẩn</TabsTrigger>
                            <TabsTrigger value="rejected">Bị từ chối</TabsTrigger>
                            <TabsTrigger value="canceled">Tin huỷ</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {total === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    Chưa có tin đăng
                                </div>
                            )}
                            {pendingListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="pending"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                    onEdit={() => handleEditListing(l)}
                                    onCancel={() => handleCanceledListing(l.id)}
                                />
                            ))}
                            {activeListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="active"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                    onHide={() => handleHideListing(l.id)}
                                />
                            ))}
                            {soldListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="sold"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                />
                            ))}
                            {expiredListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="expired"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                    onHide={() => handleHideListing(l.id)}
                                />
                            ))}
                            {rejectedListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="rejected"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                />
                            ))}
                            {canceledListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="canceled"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                />
                            ))}
                        </TabsContent>

                        {/* Các tab */}
                        <TabsContent value="pending">
                            {pendingListings.length === 0 && (
                                <div className="text-gray-500">Không có tin chờ duyệt</div>
                            )}
                            {pendingListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="pending"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                    onEdit={() => handleEditListing(l)}
                                    onCancel={() => handleCanceledListing(l.id)}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="active">
                            {activeListings.length === 0 && (
                                <div className="text-gray-500">Không có tin đang bán</div>
                            )}
                            {activeListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="active"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                    onHide={() => handleHideListing(l.id)}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="sold">
                            {soldListings.length === 0 && (
                                <div className="text-gray-500">Không có tin đã bán</div>
                            )}
                            {soldListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="sold"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="expired">
                            {expiredListings.length === 0 && (
                                <div className="text-gray-500">Không có tin ẩn</div>
                            )}
                            {expiredListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="expired"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                    onHide={() => handleHideListing(l.id)}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="rejected">
                            {rejectedListings.length === 0 && (
                                <div className="text-gray-500">Không có tin bị từ chối</div>
                            )}
                            {rejectedListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="rejected"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="canceled">
                            {canceledListings.length === 0 && (
                                <div className="text-gray-500">Không có tin huỷ</div>
                            )}
                            {canceledListings.map((l) => (
                                <GenericListingCard
                                    key={l.id}
                                    type="canceled"
                                    listing={l}
                                    onView={() => handleViewDetail(l)}
                                />
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <EditListingModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                listing={editingListing}
                onUpdate={handleListingUpdated}
            />
        </>
    )
}

export default ListingsSection
