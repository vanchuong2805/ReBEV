import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
import { useCart } from "@/contexts/CartContext";

import ListingGallery from "../components/ListingGallery";
import ListingDescription from "../components/ListingDescription";
import ListingActions from "../components/ListingActions";
import ListingSellerInfo from "../components/ListingSellerInfo";
import RelatedListings from "../components/RelatedListings";
import { toast } from "sonner";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [listingId]);

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

        setOtherPosts(otherRes.filter((p) => p.id !== postRes.id));
        setSimilarPosts(similarRes.filter((p) => p.id !== postRes.id));
        setVariationValuesId(varValRes);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId, user]);

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

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để mua hàng");
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
      console.error("Lỗi ẩn bài:", err);
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
        const res = await getPosts({
          user_id: listing.user_id,
          status: 1,
          page: next,
          limit,
        });
        setOtherPosts((prev) => [...prev, ...res]);
        setPageOther(next);
        setHasMoreOther(res.length >= limit);
      } else {
        const next = pageSimilar + 1;
        const res = await getPosts({
          category_id: listing.category_id,
          status: 1,
          page: next,
          limit,
        });
        setSimilarPosts((prev) => [...prev, ...res]);
        setPageSimilar(next);
        setHasMoreSimilar(res.length >= limit);
      }
    } catch (err) {
      console.error("Lỗi tải thêm bài:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 text-sm">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sản phẩm không tồn tại
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Sản phẩm này có thể đã bị xóa hoặc không khả dụng
          </p>
          <button
            onClick={() => navigate(from)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const seller = postSeller || {
    id: 1,
    name: "Người bán",
    avatar: listing.user_avatar,
  };

  const categoryInfo = categories.find((c) => c.id === listing.category_id);
  const baseInfo = bases.find((b) => b.id === listing.base_id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 space-y-8"
          >
            <ListingGallery
              listing={listing}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
            />
            <ListingDescription
              listing={listing}
              variations={variations}
              variationValuesId={variationValuesId}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 space-y-4">
                  {categoryInfo && (
                    <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-md">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        {categoryInfo.name}
                      </span>
                    </div>
                  )}

                  <h1 className="text-[22px] font-semibold text-gray-900 leading-snug">
                    {listing.title}
                  </h1>

                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-[24px] font-bold text-red-600">
                      {formatPrice(listing.price)}
                    </span>
                  </div>

                  <ListingActions
                    listing={listing}
                    seller={seller}
                    user={user}
                    categoryInfo={categoryInfo}
                    handleBuyNow={handleBuyNow}
                    handleHidePost={handleHidePost}
                    navigate={navigate}
                  />
                </div>

                <div className="border-t border-gray-100 p-5">
                  <ListingSellerInfo
                    seller={seller}
                    listing={listing}
                    baseInfo={baseInfo}
                    postContact={postContact}
                    formatDate={formatDate}
                    handleViewShop={handleViewShop}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
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
      </div>
    </div>
  );
};

export default ListingDetail;
