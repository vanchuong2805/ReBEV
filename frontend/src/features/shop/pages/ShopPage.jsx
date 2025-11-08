import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getBases, getPosts, getUserById, getContactById } from "../service"
import { Store, Star, Package, TrendingUp, MapPin } from "lucide-react"

function getThumbnailUrl(post) {
  try {
    const media = typeof post.media === "string" ? JSON.parse(post.media) : post.media || []
    const thumb = media.find((m) => m.is_thumbnail) || media[0]
    return thumb?.url?.replace(/^image\s+|^video\s+/i, "") || "/placeholder.png"
  } catch {
    return "/placeholder.png"
  }
}

export default function ShopPage() {
  const { sellerId } = useParams()
  const navigate = useNavigate()

  const [seller, setSeller] = useState(null)
  const [activePosts, setActivePosts] = useState([])
  const [soldPosts, setSoldPosts] = useState([])
  const [reservedPosts, setReservedPosts] = useState([])
  const [bases, setBases] = useState([])
  const [tab, setTab] = useState("active")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [userRes, activeRes, soldRes, reservedRes, baseRes] = await Promise.all([
          getUserById(sellerId),
          getPosts({ user_id: sellerId, status: 1 }),
          getPosts({ user_id: sellerId, status: 3 }),
          getPosts({ user_id: sellerId, status: 7 }),
          getBases(),
        ])
        setSeller(userRes)
        setBases(baseRes)

        const attachContacts = async (posts) => {
          return Promise.all(
            posts.map(async (p) => {
              if (p.seller_contact_id) {
                try {
                  const c = await getContactById(p.seller_contact_id)
                  return { ...p, postContact: c }
                } catch {
                  return { ...p, postContact: null }
                }
              }
              return { ...p, postContact: null }
            })
          )
        }

        const [activeWithContact, soldWithContact, reservedWithContact] = await Promise.all([
          attachContacts(activeRes),
          attachContacts(soldRes),
          attachContacts(reservedRes),
        ])

        setActivePosts(activeWithContact)
        setSoldPosts(soldWithContact)
        setReservedPosts(reservedWithContact)
      } catch (err) {
        console.error("Lỗi tải dữ liệu shop:", err)
      } finally {
        setLoading(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
    fetchData()
  }, [sellerId])

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent"></div>
          <p className="mt-3 text-gray-600 text-sm">Đang tải...</p>
        </div>
      </div>
    )

  if (!seller)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">Không tìm thấy cửa hàng</p>
        </div>
      </div>
    )

  const display =
    tab === "active" ? activePosts : tab === "sold" ? soldPosts : reservedPosts

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  const avgRating =
    seller.rating_count > 0
      ? (seller.total_rating / seller.rating_count).toFixed(1)
      : "0.0"

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={
                seller.avatar ||
                "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg"
              }
              alt={seller.display_name || "Người bán"}
              className="w-24 h-24 rounded-full object-cover border border-gray-200"
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {seller.display_name || "Người bán"}
              </h1>
              <p className="text-gray-500 text-sm mb-4">Người bán</p>

              <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-900">{avgRating}</span>
                  <span className="text-gray-500">({seller.rating_count})</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>{activePosts.length + soldPosts.length + reservedPosts.length} sản phẩm</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{soldPosts.length} đã bán</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6 border-b mb-8">
          {[
            { key: "active", label: "Đang bán", count: activePosts.length },
            { key: "reserved", label: "Đặt trước", count: reservedPosts.length },
            { key: "sold", label: "Đã bán", count: soldPosts.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 font-medium text-sm border-b-2 transition-colors ${
                tab === t.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Grid */}
        {display.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Chưa có sản phẩm</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {display.map((post) => {
              const base = bases.find((b) => b.id === post.base_id)
              const contactAddr = post.postContact
                ? `${post.postContact.district_name || ""}, ${post.postContact.province_name || ""}`
                : ""
              const thumbnailUrl = getThumbnailUrl(post)

              return (
                <div
                  key={post.id}
                  onClick={() => navigate(`/marketplace/listing/${post.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    {tab === "sold" && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="text-gray-700 text-sm font-medium">Đã bán</span>
                      </div>
                    )}
                    {tab === "reserved" && (
                      <div className="absolute inset-0 bg-yellow-100/80 flex items-center justify-center">
                        <span className="text-yellow-800 text-sm font-medium">Đặt trước</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-900 line-clamp-2 mb-1 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-base font-semibold text-gray-900 mb-1">
                      {formatPrice(post.price)}
                    </p>

                    <p className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">
                        {base?.name || contactAddr || "Không rõ"}
                      </span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
