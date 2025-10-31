import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft
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
  getVariationValues,
} from "../service";
import { useUser } from "@/contexts/UserContext";

// === Import các components con mà bạn đã tạo ===
import ListingGallery from "../components/ListingGallery";
import ListingDescription from "../components/ListingDescription";
import ListingActions from "../components/ListingActions";
import ListingSellerInfo from "../components/ListingSellerInfo";
import ListingSafetyTips from "../components/ListingSafetyTips";
import RelatedListings from "../components/RelatedListings";
import ChatWindow from "@/features/chat/components/ChatWindow";
import { useCart } from "@/contexts/CartContext";

const ListingDetail = () => {
  const { user } = useUser();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profile?tab=listings";
  const { addToCart, setBuyNowItem } = useCart();
  const [listing, setListing] = useState(null);
  const [variations, setVariations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bases, setBases] = useState([]);
  const [postSeller, setPostSeller] = useState(null);
  const [postContact, setPostContact] = useState(null);
  const [variationValuesId, setVariationValuesId] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pageOther, setPageOther] = useState(1);
  const [pageSimilar, setPageSimilar] = useState(1);
  const [limit] = useState(5);
  const [hasMoreOther, setHasMoreOther] = useState(true);
  const [hasMoreSimilar, setHasMoreSimilar] = useState(true);

  // ====== Fetch dữ liệu ======
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

        // parse media JSON
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
          getPosts({ category_id: postRes.category_id, status: 1, page: 1, limit }),
        ])
        setOtherPosts(otherRes)
        setSimilarPosts(similarRes)
        setVariationValuesId(varValRes)
      } catch (err) {
        console.error(" Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId, user]);

  // ====== Format helpers ======
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));

  // ====== Các hành động ======
  const handleBuyNow = async () => {
    if (!user) {
      alert(" Bạn cần đăng nhập để mua hàng");
      return;
    }
    try {
      await addToCart(user.id, listing.id);
      setBuyNowItem(listing.id);
      navigate("/checkout");
    } catch (error) {
      console.log(error);
    }
  };

  

  const handleHidePost = async (id) => {
    try {
      await updatePostVisibility(id);
      setListing((prev) => ({ ...prev, is_hidden: !prev.is_hidden }));
    } catch (err) {
      console.error(" Lỗi ẩn bài:", err);
    }
  };

  const handleViewShop = () =>
    navigate(`/shop/${postSeller?.id}`, {
      state: { from: `/marketplace/listing/${listing.id}` },
    });

  const handleLoadMore = async (type) => {
    try {
      if (type === "other") {
        const next = pageOther + 1;
        const res = await getPosts({ user_id: listing.user_id, status: 1, page: next, limit });
        setOtherPosts((prev) => [...prev, ...res]);
        setPageOther(next);
        setHasMoreOther(res.length >= limit);
      } else {
        const next = pageSimilar + 1;
        const res = await getPosts({ category_id: listing.category_id, status: 1, page: next, limit });
        setSimilarPosts((prev) => [...prev, ...res]);
        setPageSimilar(next);
        setHasMoreSimilar(res.length >= limit);
      }
    } catch (err) {
      console.error(" Lỗi tải thêm bài:", err);
    }
  };

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
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-5 h-5" /> <span>Quay lại danh sách</span>
        </button>
      </div>
    );

  const seller = postSeller || { id: 1, name: "Người bán", avatar: listing.user_avatar };
  const categoryInfo = categories.find((c) => c.id === listing.category_id);
  const baseInfo = bases.find((b) => b.id === listing.base_id);

  // ====== Render chính ======
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(from)}
            className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600"
          >
            <ChevronLeft className="w-5 h-5" /> <span>Quay lại</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
        <div className="lg:col-span-2 space-y-4">
          <ListingGallery listing={listing} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
          <ListingDescription listing={listing} variations={variations} variationValuesId={variationValuesId} />
        </div>

        <div className="space-y-4">
          <div className="sticky top-20 bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>
            <p className="text-3xl font-semibold text-blue-700 mb-4">{formatPrice(listing.price)}</p>

            <ListingActions
              listing={listing}
              seller={seller}
              user={user}
              categoryInfo={categoryInfo}
              handleBuyNow={handleBuyNow}
              handleHidePost={handleHidePost}
              navigate={navigate}
            />

            <ListingSellerInfo
              seller={seller}
              listing={listing}
              baseInfo={baseInfo}
              postContact={postContact}
              formatDate={formatDate}
              handleViewShop={handleViewShop}
            />

            <ListingSafetyTips />
          </div>
        </div>
      </div>

      {/* Tin khác & Tin tương tự */}
      <RelatedListings
        seller={seller}
        otherPosts={otherPosts}
        similarPosts={similarPosts}
        formatPrice={formatPrice}
        hasMoreOther={hasMoreOther}
        hasMoreSimilar={hasMoreSimilar}
        handleLoadMore={handleLoadMore}
        navigate={navigate}
      />
    </div>
  );
};

export default ListingDetail;
