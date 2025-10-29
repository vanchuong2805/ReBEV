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
  getVariationValues,
} from "../service";
import { useUser } from "@/contexts/UserContext";
import ChatWindow from "@/features/chat/components/ChatWindow";
import { useCart } from "@/contexts/CartContext";

const ListingDetail = () => {
  const { user } = useUser();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profile?tab=listings";
  const { addToCart } = useCart();
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
  const [variationValuesId, setVariationValuesId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postRes = await getPostById(listingId);
        const [varRes, cateRes, baseRes, userRes, contactRes, varValRes] =
          await Promise.all([
            getVariations(),
            getCategories(),
            getBases(),
            getUserById(postRes.user_id),
            postRes.seller_contact_id
              ? getContactById(postRes.seller_contact_id)
              : Promise.resolve(null),
            getVariationValues(),
          ]);

        let mediaParsed = [];
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
          getPosts({
            category_id: postRes.category_id,
            status: 1,
            page: 1,
            limit,
          }),
        ]);
        setOtherPosts(otherRes);
        setSimilarPosts(similarRes);
        setVariationValuesId(varValRes);
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
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );

  if (!listing)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p className="mb-4 text-lg">Không tìm thấy bài đăng.</p>
        <button
          onClick={() => navigate(from)}
          className="flex items-center gap-2 text-gray-700 transition hover:text-blue-600"
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
      await addToCart(user.id, postId);
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
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
          <button
            onClick={() => navigate(from)}
            className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại danh sách</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 px-4 py-6 mx-auto max-w-7xl lg:grid-cols-3">
        {/* ===== Cột trái ===== */}
        <div className="space-y-4 lg:col-span-2">
          {/* Ảnh */}
          <div className="overflow-hidden bg-white shadow-sm rounded-xl">
            <div className="relative flex items-center justify-center bg-gray-200 aspect-video">
              {listing.media?.length > 0 && (
                <img
                  src={listing.media[currentImageIndex]?.url?.replace(
                    /^image\s+|^video\s+/i,
                    ""
                  )}
                  alt={listing.title}
                  className="object-contain h-full "
                />
              )}

              {listing.media?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute px-3 py-1 text-sm text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-black/60">
                    {currentImageIndex + 1} / {listing.media.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-3 text-lg font-semibold">Mô tả chi tiết</h2>
            <div
              className="leading-relaxed prose text-gray-700 max-w-none"
              dangerouslySetInnerHTML={{ __html: listing.description }}
            />
          </div>
          {/* Thông số kỹ thuật */}
          {listing.post_details?.length > 0 && (
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h2 className="mb-4 text-lg font-semibold">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                {listing.post_details.map((detail) => {
                  const v = variations.find(
                    (vv) => vv.id === detail.variation_id
                  );
                  const varVal = variationValuesId.find(
                    (vv) => vv.id === detail.variation_value_id
                  );
                  return (
                    <div key={detail.variation_id}>
                      <p className="text-sm text-gray-500">{v?.name}</p>
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
          <div className="sticky p-6 bg-white shadow-sm rounded-xl top-20">
            {/* Tiêu đề & giá */}
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              {listing.title}
            </h1>
            <p className="mb-4 text-3xl font-bold text-red-600">
              {formatPrice(listing.price)}
            </p>

            {/* ===== NÚT HÀNH ĐỘNG / ĐÁNH GIÁ ===== */}
            {Number(listing.status) === 3 ? (
              // Nếu sản phẩm đã bán
              <div className="py-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                <p className="mb-1 text-lg font-semibold text-gray-700">
                  🔒 Sản phẩm đã bán
                </p>
                <p className="text-xl font-bold text-red-600">
                  {formatPrice(listing.price)}
                </p>

                {/* ===== PHẦN ĐÁNH GIÁ ===== */}
                <div className="mt-5 text-left">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Đánh giá sản phẩm
                  </h3>

                  {listing.reviews?.length > 0 ? (
                    <div className="space-y-3">
                      {listing.reviews.map((review, idx) => (
                        <div key={idx} className="pb-3 border-b">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              {review.user_name}
                            </span>
                            <span className="text-sm text-yellow-500">
                              {"⭐".repeat(review.rating)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {review.comment}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-500">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                  )}

                  {/* Nếu là người mua (không phải người bán) thì cho phép viết đánh giá */}
                  {user && user.id !== seller.id && (
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium text-gray-800">
                        Viết đánh giá của bạn
                      </h4>
                      <textarea
                        className="w-full p-2 mb-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400"
                        rows={3}
                        placeholder="Nhập nội dung đánh giá..."
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={() => alert(" Đã gửi đánh giá!")}
                          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
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
                  className="w-full px-4 py-3 mb-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Hiện tin
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleHidePost(listing.id);
                    alert(" Tin đã được ẩn");
                  }}
                  className="w-full px-4 py-3 mb-3 font-semibold text-white transition bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Ẩn tin
                </button>
              )
            ) : (
              //  Nếu là người xem khác
              <>
                <button
                  onClick={() => handleBuyNow()}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <CreditCard className="w-5 h-5" />{" "}
                  {categoryInfo?.id === 1 ? "Đặt cọc ngay" : "Mua ngay"}
                </button>

                {listing.category_id !== 1 && (
                  <button
                    onClick={() => handleAddToCart(listing.id)}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-3 font-semibold text-white transition bg-orange-500 rounded-lg hover:bg-orange-600"
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
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <MessageCircle className="w-5 h-5" /> Nhắn tin
                </button>
              </>
            )}

            {/* ===== ĐỊA CHỈ & NGÀY ĐĂNG ===== */}
            <div className="flex items-center gap-2 mt-6 mb-2 text-sm text-gray-700">
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

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Đăng {formatDate(listing.create_at)}</span>
            </div>

            {/* ===== NGƯỜI BÁN ===== */}
            <div
              className="pt-4 border-t cursor-pointer"
              onClick={handleViewShop}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={seller.avatar || "/placeholder.jpg"}
                  alt={seller.display_name || "Seller Avatar"}
                  className="object-cover w-12 h-12 rounded-full"
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
            <div className="pt-5 mt-5 border-t">
              <h4 className="mb-2 text-sm font-semibold text-gray-900">
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
      <div className="px-4 py-8 mx-auto space-y-10 max-w-7xl">
        {/* Tin khác của người bán */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Tin rao khác của {seller.display_name || "người bán"}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {otherPosts.map((p) => {
              const thumbnailUrl = getThumbnailUrl(p);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/marketplace/listing/${p.id}`)}
                  className="overflow-hidden transition bg-white shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                >
                  <img
                    src={thumbnailUrl}
                    alt={p.title}
                    className="object-cover w-full h-40"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-red-600">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMoreOther && (
            <div className="mt-6 text-center">
              <button
                onClick={() => handleLoadMore("other")}
                className="px-5 py-2 text-gray-700 transition border border-gray-300 rounded-full hover:bg-gray-100"
              >
                Xem thêm bài đăng
              </button>
            </div>
          )}
        </div>

        {/* Tin tương tự */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Tin đăng tương tự</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {similarPosts.map((p) => {
              const thumbnailUrl = getThumbnailUrl(p);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/marketplace/listing/${p.id}`)}
                  className="overflow-hidden transition bg-white shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                >
                  <img
                    src={thumbnailUrl}
                    alt={p.title}
                    className="object-cover w-full h-40"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-red-600">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMoreSimilar && (
            <div className="mt-6 text-center">
              <button
                onClick={() => handleLoadMore("similar")}
                className="px-5 py-2 text-gray-700 transition border border-gray-300 rounded-full hover:bg-gray-100"
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
