import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getBases, getPosts, getUserById } from "../service"

function getThumbnailUrl(post) {
  let thumbnailUrl = "/placeholder.png"
  try {
    const media = post.media
    const parsed =
      typeof media === "string"
        ? JSON.parse(media)
        : Array.isArray(media)
          ? media
          : []
    const thumb = parsed.find((item) => item.is_thumbnail) || parsed[0]
    if (thumb?.url) thumbnailUrl = thumb.url.replace(/^image\s+|^video\s+/i, "")
  } catch (e) {
    console.error(" Lỗi parse media:", e)
  }
  return thumbnailUrl
}

export default function ShopPage() {
  const { sellerId } = useParams()
  const navigate = useNavigate()

  const [seller, setSeller] = useState(null)
  const [activePosts, setActivePosts] = useState([])
  const [soldPosts, setSoldPosts] = useState([])
  const [bases, setBases] = useState([])
  const [tab, setTab] = useState("active")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [userRes, activeRes, soldRes, baseRes] = await Promise.all([
          getUserById(sellerId),
          getPosts({ user_id: sellerId, status: 1 }),
          getPosts({ user_id: sellerId, status: 6 }),
          getBases(),
        ])
        setSeller(userRes)
        setActivePosts(activeRes)
        setSoldPosts(soldRes)
        setBases(baseRes)
        console.log(" Dữ liệu Shop tải thành công", userRes)
      } catch (err) {
        console.error(" Lỗi tải dữ liệu Shop:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [sellerId])

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Đang tải dữ liệu cửa hàng...
      </div>
    )

  if (!seller)
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy người bán
      </div>
    )

  const display = tab === "active" ? activePosts : soldPosts

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)

  return (
    <div className="max-w-[1200px] mx-auto bg-[#f8f8f8] py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-[28%] bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center">
            <img
              src={seller.avatar || "/placeholder.jpg"}
              className="w-24 h-24 rounded-full object-cover mb-3"
              alt={seller.display_name || "Người bán"}
            />
            <h2 className="text-lg font-semibold">
              {seller.display_name || "Người bán"}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < Math.round(seller.total_rating / seller.rating_count) ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={`w-4 h-4 ${i < Math.round(seller.total_rating / seller.rating_count) ? "text-yellow-500" : "text-gray-300"}`}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.601c.969 0 1.371 1.24.588 1.81l-5.345 3.89a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.345-3.89a1 1 0 00-1.176 0l-5.345 3.89c-.785.57-1.84-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118l-5.345-3.89c-.783-.57-.38-1.81.588-1.81h6.601a1 1 0 00.95-.69l2.036-6.29z" />
                </svg>
              ))}
              <span className="text-[15px] font-medium text-gray-900 ml-1">
                {(seller.total_rating / seller.rating_count).toFixed(1)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({seller.rating_count})
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
          {/* Tabs */}
          <div className="flex border-b mb-5">
            <button
              className={`px-5 py-2 font-medium text-sm ${tab === "active"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
                }`}
              onClick={() => setTab("active")}
            >
              Đang hiển thị ({activePosts.length})
            </button>
            <button
              className={`px-5 py-2 font-medium text-sm ${tab === "sold"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
                }`}
              onClick={() => setTab("sold")}
            >
              Đã bán ({soldPosts.length})
            </button>
          </div>

          {/* Listings grid */}
          {display.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Chưa có tin nào trong mục này
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {display.map((post) => {
                const base = bases.find((b) => b.id === post.base_id)
                const thumbnailUrl = getThumbnailUrl(post)

                return (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/marketplace/listing/${post.id}`)}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white cursor-pointer"
                  >
                    <img
                      src={thumbnailUrl}
                      alt={post.title}
                      className="w-full h-44 object-cover"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-medium line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-red-600 font-semibold mt-1 text-sm">
                        {formatPrice(post.price)}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {base?.name || "Không rõ địa điểm"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
