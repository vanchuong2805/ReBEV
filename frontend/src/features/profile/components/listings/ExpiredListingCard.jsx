// components/listings/ExpiredListingCard.jsx
import { Battery as BatteryIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ExpiredListingCard = ({ listing }) => {
  return (
    <div className="border rounded-lg p-6 bg-orange-50">
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
              <p className="text-sm text-orange-700 mt-2">
                Tin đã hết hạn đăng. Gia hạn để tiếp tục hiển thị.
              </p>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              Hết hạn
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-600">{listing.price}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hết hạn: {listing.expiredAt}</span>
              <div className="flex gap-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Gia hạn</Button>
                <Button size="sm" variant="outline">Chỉnh sửa</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ExpiredListingCard
