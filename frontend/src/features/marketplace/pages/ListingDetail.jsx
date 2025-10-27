import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import {
  getPostById,
  getVariations,
  getCategories,
  getBases,
  getUserById,
  getContactById,
  getPosts,
  updatePostVisibility,
  addCarts,
} from "../service";
import { useUser } from "@/contexts/UserContext";
import ChatWindow from "@/features/chat/components/ChatWindow";

const ListingDetail = () => {
  const { user } = useUser();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profile?tab=listings";

  const [listing, setListing] = useState(null);
  const [variations, setVariations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bases, setBases] = useState([]);
  const [postSeller, setPostSeller] = useState(null);
  const [postContact, setPostContact] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [otherPosts, setOtherPosts] = useState([]);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageOther, setPageOther] = useState(1);
  const [pageSimilar, setPageSimilar] = useState(1);
  const [limit] = useState(2);
  const [hasMoreOther, setHasMoreOther] = useState(true);
  const [hasMoreSimilar, setHasMoreSimilar] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const postRes = await getPostById(listingId)
        const [varRes, cateRes, baseRes, userRes, contactRes,varValRes] = await Promise.all([
          getVariations(),
          getCategories(),
          getBases(),
          getUserById(postRes.user_id),
          postRes.seller_contact_id
            ? getContactById(postRes.seller_contact_id)
            : Promise.resolve(null),
          getVariationValues(),
        ])


        let mediaParsed = []
        try {
          mediaParsed =
            typeof postRes.media === "string"
              ? JSON.parse(postRes.media)
              : Array.isArray(postRes.media)
              ? postRes.media
              : [];
        } catch {
          mediaParsed = [];
        }

        setListing({ ...postRes, media: mediaParsed });
        setVariations(varRes);
        setCategories(cateRes);
        setBases(baseRes);
        setPostSeller(userRes);
        setPostContact(contactRes);
        const [otherRes, similarRes] = await Promise.all([
          getPosts({ user_id: postRes.user_id, status: 1, page: 1, limit }),
          getPosts({ category_id: postRes.category_id, status: 1, page: 1, limit }),
        ])
        setOtherPosts(otherRes)
        setSimilarPosts(similarRes)
        setVariationValuesId(varValRes)
      } catch (error) {
        console.error(" Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId, user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );

  if (!listing)
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
    );

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % (listing.media?.length || 1));
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (listing.media?.length || 1)) % (listing.media?.length || 1)
    );

  const handleBuyNow = () => alert(` Mua ngay: ${listing.title}`);
  const handleAddToCart = async (postId) => {
    if (!user) {
      alert(" Bạn cần đăng nhập để thêm vào giỏ hàng");
      return;
    }

    try {
      await addCarts(user.id, postId);
      alert(`🛒 Đã thêm "${listing.title}" vào giỏ hàng thành công!`);
    } catch (error) {
      console.error(" Lỗi khi thêm vào giỏ hàng:", error);
      alert(" Thêm vào giỏ hàng thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleViewShop = () =>
    navigate(`/shop/${postSeller?.id}`, {
      state: { from: `/marketplace/listing/${listing.id}` },
    });

  const categoryInfo = categories.find((c) => c.id === listing.category_id);
  const baseInfo = bases.find((b) => b.id === listing.base_id);
  const seller = postSeller || {
    id: 1,
    name: "Người bán",
    avatar: listing.user_avatar,
  };

  const handleLoadMore = async (type) => {
    try {
      if (type === "other") {
        const nextPage = pageOther + 1;
        const res = await getPosts({
          user_id: listing.user_id,
          status: 1,
          page: nextPage,
          limit,
        });
        setOtherPosts((prev) => [...prev, ...res]);
        setPageOther(nextPage);
        setHasMoreOther(res.length >= limit);
      } else {
        const nextPage = pageSimilar + 1;
        const res = await getPosts({
          category_id: listing.category_id,
          status: 1,
          page: nextPage,
          limit,
        });
        setSimilarPosts((prev) => [...prev, ...res]);
        setPageSimilar(nextPage);
        setHasMoreSimilar(res.length >= limit);
      }
    } catch (err) {
      console.error(" Lỗi tải thêm bài:", err);
    }
  };
  const handleHidePost = async (listingId) => {
    try {
      await updatePostVisibility(listingId);
      setListing((prev) => ({
        ...prev,
        is_hidden: !prev.is_hidden,
      }));
      console.log(" Ẩn tin thành công:", listingId);
    } catch (error) {
      console.error(" Lỗi ẩn tin đăng:", error);
    }
  };

  function getThumbnailUrl(post) {
    let thumbnailUrl = "/placeholder.png";
    try {
      const media = post.media;
      const parsed =
        typeof media === "string"
          ? JSON.parse(media)
          : Array.isArray(media)
          ? media
          : [];

      // Ưu tiên ảnh có is_thumbnail, fallback ảnh đầu tiên
      const thumb = parsed.find((item) => item.is_thumbnail) || parsed[0];
      if (thumb?.url) {
        thumbnailUrl = thumb.url.replace(/^image\s+|^video\s+/i, "");
      }
    } catch (e) {
      console.error(" Lỗi parse media:", e);
    }
    return thumbnailUrl;
  }

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
        {/* ===== Cột trái ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ảnh */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
              {listing.media?.length > 0 && (
                <img
                  src={listing.media[currentImageIndex]?.url?.replace(
                    /^image\s+|^video\s+/i,
                    ""
                  )}
                  alt={listing.title}
                  className="h-full object-contain "
                />
              )}

              {listing.media?.length > 1 && (
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
                    {currentImageIndex + 1} / {listing.media.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-3">Mô tả chi tiết</h2>
            <div
              className="text-gray-700 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: listing.description }}
            />
          </div>
          {/* Thông số kỹ thuật */}
          {listing.post_details?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                {listing.post_details.map((detail) => {
                  const v = variations.find((vv) => vv.id === detail.variation_id)
                  const varVal = variationValuesId.find((vv) => vv.id === detail.variation_value_id)
                  return (
                    <div key={detail.variation_id}>
                      <p className="text-gray-500 text-sm">{v?.name}</p>
                      <p className="font-medium text-gray-900">
                        {detail.custom_value !== "null"
                          ? detail.custom_value
                          : varVal?.value || "N/A"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ===== CỘT PHẢI ===== */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
            {/* Tiêu đề & giá */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {listing.title}
            </h1>
            <p className="text-3xl font-bold text-red-600 mb-4">
              {formatPrice(listing.price)}
            </p>

            {/* ===== NÚT HÀNH ĐỘNG / ĐÁNH GIÁ ===== */}
            {Number(listing.status) === 3 ? (
              // Nếu sản phẩm đã bán
              <div className="text-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  🔒 Sản phẩm đã bán
                </p>
                <p className="text-red-600 font-bold text-xl">
                  {formatPrice(listing.price)}
                </p>

                {/* ===== PHẦN ĐÁNH GIÁ ===== */}
                <div className="mt-5 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Đánh giá sản phẩm
                  </h3>

                  {listing.reviews?.length > 0 ? (
                    <div className="space-y-3">
                      {listing.reviews.map((review, idx) => (
                        <div key={idx} className="border-b pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              {review.user_name}
                            </span>
                            <span className="text-yellow-500 text-sm">
                              {"⭐".repeat(review.rating)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                  )}

                  {/* Nếu là người mua (không phải người bán) thì cho phép viết đánh giá */}
                  {user && user.id !== seller.id && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Viết đánh giá của bạn
                      </h4>
                      <textarea
                        className="w-full border rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-orange-400"
                        rows={3}
                        placeholder="Nhập nội dung đánh giá..."
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={() => alert(" Đã gửi đánh giá!")}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
                        >
                          Gửi đánh giá
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : seller.id === user?.id ? (
              //  Nếu là người đăng bài
              listing.is_hidden ? (
                <button
                  onClick={() => {
                    handleHidePost(listing.id);
                    alert(" Tin đã được hiển thị lại");
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition mb-3"
                >
                  Hiện tin
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleHidePost(listing.id);
                    alert(" Tin đã được ẩn");
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition mb-3"
                >
                  Ẩn tin
                </button>
              )
            ) : (
              //  Nếu là người xem khác
              <>
                <button
                  onClick={() => handleBuyNow()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mb-3"
                >
                  <CreditCard className="w-5 h-5" /> {categoryInfo?.id === 1 ? 'Đặt cọc ngay' : 'Mua ngay'}
                </button>

                {listing.category_id !== 1 && (
                  <button
                    onClick={() => handleAddToCart(listing.id)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mb-3"
                  >
                    <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate(
                      `/chat?buyer=${user.id}&seller=${listing.user_id}`
                    );
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-5 h-5" /> Nhắn tin
                </button>
              </>
            )}

            {/* ===== ĐỊA CHỈ & NGÀY ĐĂNG ===== */}
            <div className="flex items-center gap-2 text-gray-700 text-sm mt-6 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              {listing.base_id && baseInfo ? (
                <span>{baseInfo.name}</span>
              ) : postContact ? (
                <span>
                  {`${postContact.detail}, ${postContact.ward_name}, ${postContact.district_name}, ${postContact.province_name}`}
                </span>
              ) : (
                <span>Không rõ địa chỉ</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-700 text-sm mb-4">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Đăng {formatDate(listing.create_at)}</span>
            </div>

            {/* ===== NGƯỜI BÁN ===== */}
            <div
              className="border-t pt-4 cursor-pointer"
              onClick={handleViewShop}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={seller.avatar || "/placeholder.jpg"}
                  alt={seller.display_name || "Seller Avatar"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {seller.display_name || "Người bán"}
                  </p>
                  <p className="text-sm text-gray-500">Hoạt động 7 giờ trước</p>
                </div>
              </div>
            </div>

            {/* ===== LƯU Ý AN TOÀN ===== */}
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

      {/* ===== CÁC TIN KHÁC ===== */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Tin khác của người bán */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Tin rao khác của {seller.display_name || "người bán"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherPosts.map((p) => {
              const thumbnailUrl = getThumbnailUrl(p);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/marketplace/listing/${p.id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <img
                    src={thumbnailUrl}
                    alt={p.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-red-600 font-semibold text-sm mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMoreOther && (
            <div className="text-center mt-6">
              <button
                onClick={() => handleLoadMore("other")}
                className="border border-gray-300 px-5 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
              >
                Xem thêm bài đăng
              </button>
            </div>
          )}
        </div>

        {/* Tin tương tự */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Tin đăng tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {similarPosts.map((p) => {
              const thumbnailUrl = getThumbnailUrl(p);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/marketplace/listing/${p.id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <img
                    src={thumbnailUrl}
                    alt={p.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-red-600 font-semibold text-sm mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMoreSimilar && (
            <div className="text-center mt-6">
              <button
                onClick={() => handleLoadMore("similar")}
                className="border border-gray-300 px-5 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
              >
                Xem thêm bài đăng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
