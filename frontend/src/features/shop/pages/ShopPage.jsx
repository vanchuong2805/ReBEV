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
      } catch (err) {
        console.error(" Lỗi tải dữ liệu Shop:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
            <div className="text-yellow-500 text-sm">⭐ 4.7 (12 đánh giá)</div>
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
