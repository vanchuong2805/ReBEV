// components/listings/PendingListingCard.jsx
import { Battery as BatteryIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const PendingListingCard = ({ listing }) => {
    return (
        <div className="border rounded-lg p-6 bg-yellow-50">
            <div className="flex gap-6">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                            <div className="flex items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1">
                                    <BatteryIcon className="w-4 h-4" />
                                    {listing.batteryHealth}% pin
                                </span>
                                {listing.mileage && <span>{listing.mileage}</span>}
                            </div>
                            <p className="text-sm text-yellow-700 mt-2">
                                Tin đang được kiểm duyệt. Thời gian duyệt: 1-2 ngày làm việc.
                            </p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Chờ duyệt
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">{listing.price}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Đăng lúc: {listing.createdAt}</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">Chỉnh sửa</Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                    Hủy tin
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PendingListingCard
