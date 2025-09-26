// components/listings/ListingCard.jsx
// src/features/profile/components/listings/ListingCard.jsx
import { Battery, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BatteryIcon } from 'lucide-react'
import { Button as ShButton } from '@/components/ui/button'


const ListingCard = ({ listing }) => {
  return (
    <div className="border rounded-lg p-6 bg-white">
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
                  {listing.batteryHealth ? `${listing.batteryHealth}% pin` : listing.condition}
                </span>
                {listing.mileage && <span>{listing.mileage}</span>}
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              Đang bán
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">{listing.price}</span>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <ShButton size="sm" variant="outline">Chỉnh sửa</ShButton>
                <ShButton size="sm" variant="outline">Thống kê</ShButton>
                <ShButton size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  Ẩn tin
                </ShButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ListingCard
