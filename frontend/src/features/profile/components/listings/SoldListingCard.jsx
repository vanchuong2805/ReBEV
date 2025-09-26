// components/listings/SoldListingCard.jsx
import { Battery as BatteryIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const SoldListingCard = ({ listing }) => {
    return (
        <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex gap-6">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-32 h-24 object-cover rounded-lg opacity-75"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">{listing.title}</h3>
                            <div className="flex items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1">
                                    <BatteryIcon className="w-4 h-4" />
                                    {listing.batteryHealth}% pin
                                </span>
                                {listing.mileage && <span>{listing.mileage}</span>}
                            </div>
                            {listing.buyer && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Đã bán cho: {listing.buyer}{listing.rating ? ` | Đánh giá: ${'⭐'.repeat(listing.rating)}` : ''}
                                </p>
                            )}
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                            Đã bán
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-600">{listing.price}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Bán ngày: {listing.soldAt}</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">Xem hợp đồng</Button>
                                <Button size="sm" variant="outline">Đăng lại</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SoldListingCard
