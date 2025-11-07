import { MapPin, Calendar } from "lucide-react"

export default function ListingSellerInfo({ seller, listing, baseInfo, postContact, formatDate, handleViewShop }) {
  return (
    <div>
      <div className="flex items-center gap-2 mt-6 mb-2 text-sm text-gray-700">
        <MapPin className="w-4 h-4 text-gray-500" />
        {listing.base_id && baseInfo ? (
          <span>{baseInfo.name}</span>
        ) : postContact ? (
          <span>{`${postContact.detail}, ${postContact.ward_name}, ${postContact.district_name}, ${postContact.province_name}`}</span>
        ) : (
          <span>Không rõ địa chỉ</span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>Đăng {formatDate(listing.create_at)}</span>
      </div>

      <div onClick={handleViewShop} className="pt-4 border-t cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition">
        <div className="flex items-center gap-3">
          <img
            src={seller.avatar || "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg"}
            alt={seller.display_name || "Seller"}
            className="object-cover w-12 h-12 rounded-full border border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-900">{seller.display_name || "Người bán"}</p>
            <p className="text-sm text-gray-500">Hoạt động 7 giờ trước</p>
          </div>
        </div>
      </div>
    </div>
  )
}
