import React, { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  Heart,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CreditCard,
} from "lucide-react"

import {
  posts,
  post_media,
  post_status,
  category,
  users,
  bases,
  post_detail,
  variation,
} from "./MockListings"

const ListingDetail = () => {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || "/profile?tab=listings"
  const [selectedListingId, setSelectedListingId] = useState(Number(listingId))
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const listing = posts.find((p) => p.id === selectedListingId)
  const images = post_media.filter((m) => m.post_id === selectedListingId)
  const status = post_status.find((s) => s.post_id === selectedListingId)
  const categoryInfo = category.find((c) => c.id === listing?.category_id)
  const seller = users.find((u) => u.id === listing?.user_id)
  const locationBase = bases.find((b) => b.id === listing?.base_id)
  const details = post_detail.filter((d) => d.post_id === selectedListingId)

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg mb-4">Không tìm thấy bài đăng.</p>
        <button
          onClick={() => navigate(from)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>
      </div>
    )
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString))

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  const handleBuyNow = () =>
    alert(`🛍️ Bạn đã chọn "Mua ngay" cho ${listing.title}`)
  const handleAddToCart = () =>
    alert(`🛒 Đã thêm "${listing.title}" vào giỏ hàng`)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(from)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại danh sách</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Cột Trái ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ảnh sản phẩm */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative aspect-video bg-gray-200">
              <img
                src={images[currentImageIndex]?.url}
                alt={listing?.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === currentImageIndex
                      ? "border-blue-500"
                      : "border-gray-200"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mô tả chi tiết */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-3">Mô tả chi tiết</h2>
            <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
              {listing?.description}
            </p>
          </div>

          {/* Thông số kỹ thuật */}
          {details.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                {details.map((detail) => {
                  const varInfo = variation.find(
                    (v) => v.id === detail.variation_id
                  )
                  return (
                    <div key={detail.variation_id}>
                      <p className="text-gray-500 text-sm">{varInfo?.name}</p>
                      <p className="font-medium text-gray-900">
                        {detail.custom_value}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cột phải */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
            {/* Tiêu đề + giá */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {listing?.title}
            </h1>
            <p className="text-3xl font-bold text-red-600 mb-4">
              {formatPrice(listing?.price)}
            </p>

            {/* 🔹 Điều kiện hiển thị nút hành động */}
            {status?.status === "approved" && (
              <>
                {/* Nếu là bài đăng của người khác */}
                {seller?.id !== 1 && ( // 👈 giả sử user hiện tại có id = 1
                  <>
                    {/* Nếu là Pin điện */}
                    {categoryInfo?.name === "Pin điện" ? (
                      <>
                        <button
                          onClick={handleAddToCart}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mb-3"
                        >
                          <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
                        </button>

                        <button
                          onClick={handleBuyNow}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mb-3"
                        >
                          <CreditCard className="w-5 h-5" /> Mua ngay
                        </button>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                          <MessageCircle className="w-5 h-5" /> Nhắn tin
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Nếu là Xe điện */}
                        <button
                          onClick={handleBuyNow}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mb-3"
                        >
                          <CreditCard className="w-5 h-5" /> Mua ngay
                        </button>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                          <MessageCircle className="w-5 h-5" /> Nhắn tin
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Nếu là bài đăng của chính tôi */}
                {seller?.id === 1 && (
                  <button
                    onClick={() =>
                      alert(
                        `🕵️ ${listing.is_hidden ? "Bỏ ẩn tin" : "Ẩn tin"}: ${listing.title}`
                      )
                    }
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    {listing.is_hidden ? "👁️ Bỏ ẩn tin" : "🙈 Ẩn tin"}
                  </button>
                )}
              </>
            )}
            {/* Nếu sản phẩm đã bán thì hiện Review */}
            {status?.status === "sold" && (
              <div className="mt-6 border-t pt-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Đánh giá sản phẩm
                </h3>

                {/* Nếu có đánh giá */}
                {listing.reviews?.length > 0 ? (
                  <div className="space-y-3">
                    {listing.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {review.user}
                          </span>
                          <span className="text-yellow-500 text-sm">
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                )}
              </div>
            )}
            {/* Địa điểm & ngày đăng */}
            <div className="flex items-center gap-2 text-gray-700 text-sm mt-6 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{locationBase?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm mb-4">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Đăng {formatDate(listing?.create_at)}</span>
            </div>

            {/* Người bán */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={seller?.avatar}
                  alt={seller?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{seller?.name}</p>
                  <p className="text-sm text-gray-500">Hoạt động 7 giờ trước</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-yellow-500 text-sm">
                ★★★★☆ <span className="text-gray-600">(4 đánh giá)</span>
              </div>
            </div>

            {/* Lưu ý an toàn */}
            <div className="mt-5 pt-5 border-t">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                Lưu ý an toàn
              </h4>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li>• Kiểm tra kỹ sản phẩm trước khi mua</li>
                <li>• Không chuyển tiền trước khi nhận hàng</li>
                <li>• Gặp mặt tại nơi công cộng</li>
                <li>• Báo cáo tin đáng ngờ</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ListingDetail
