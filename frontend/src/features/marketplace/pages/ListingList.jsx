// src/features/home/pages/ListingList.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useParams,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Heart, Filter, MapPin } from "lucide-react";
import { getFeaturedProducts } from "@/features/home/service";
import { toast } from "sonner";
import FilterSearch from "../components/FilterSearch";

function currency(v) {
  return Number(v || 0).toLocaleString("vi-VN") + " ₫";
}

function getThumb(media) {
  try {
    const arr = JSON.parse(media);
    const pick = arr.find((m) => m.is_thumbnail) || arr[0];
    if (!pick?.url) return "/placeholder.webp";
    return pick.url.replace(/^(image|video)\s+/, "");
  } catch {
    return "/placeholder.webp";
  }
}

export default function ListingList() {
  const location = useLocation();
  const { category } = useParams();
  const [searchParams] = useSearchParams();

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy search từ URL query params
  const searchFromUrl = searchParams.get("search") || "";

  // Sort + favorites
  const [sortBy, setSortBy] = useState("newest");
  const [displayCount, setDisplayCount] = useState(10);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const observerTarget = useRef(null);

  // Fetch API với filter params
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Build query params từ URL
        const queryParams = {};

        // Category từ route hoặc từ searchParams
        const categoryIds = searchParams
          .get("categories")
          ?.split(",")
          .filter(Boolean)
          .map(Number);
        if (categoryIds && categoryIds.length > 0) {
          queryParams.category_id = categoryIds[0]; // Backend chỉ nhận 1 category
        } else if (category === "xe") {
          queryParams.category_id = 1;
        } else if (category === "pin") {
          queryParams.category_id = 2;
        }

        // Search
        if (searchFromUrl) {
          queryParams.search = searchFromUrl;
        }

        // Brands
        const brands = searchParams.get("brands")?.split(",").filter(Boolean);
        if (brands && brands.length > 0) {
          queryParams.brand = brands.join(",");
        }

        // Price range
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        if (minPrice) queryParams.minPrice = minPrice;
        if (maxPrice) queryParams.maxPrice = maxPrice;

        console.log("🔍 Fetching with params:", queryParams);

        const res = await getFeaturedProducts(queryParams);
        const list = Array.isArray(res) ? res : res?.data || [];

        // Chỉ lấy Approved + chuẩn hóa field ảnh, ngày
        const approved = list
          .filter((p) => p?.status === 1)
          .map((p) => ({
            ...p,
            image: getThumb(p.media),
            created_at: p.create_at || p.created_at || null,
          }));

        setAllItems(approved);
      } catch (e) {
        console.error(e);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, searchParams, searchFromUrl]);

  // Chỉ sort items từ BE, không lọc nữa (BE đã lọc rồi)
  const filteredItems = useMemo(() => {
    let items = [...allItems];

    // Sort
    if (sortBy === "price-asc") {
      items.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      items.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      // newest
      items.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    }

    return items;
  }, [allItems, sortBy]);

  // Calculate price range từ filtered items
  const { priceMin, priceMax } = useMemo(() => {
    if (filteredItems.length === 0) return { priceMin: 0, priceMax: 0 };
    const prices = filteredItems.map((item) => Number(item.price) || 0);
    return {
      priceMin: Math.min(...prices),
      priceMax: Math.max(...prices),
    };
  }, [filteredItems]);

  // Infinite scroll
  useEffect(() => {
    setDisplayCount(10); // reset khi filter/sort đổi
  }, [filteredItems.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredItems.length) {
          setDisplayCount((prev) => Math.min(prev + 10, filteredItems.length));
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [filteredItems.length, displayCount]);

  const displayItems = filteredItems.slice(0, displayCount);

  // Favorites
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      toast.dismiss();
      if (prev.includes(id)) {
        toast.info("Đã xóa khỏi yêu thích");
        return prev.filter((x) => x !== id);
      } else {
        toast.success("Đã thêm vào yêu thích");
        return [...prev, id];
      }
    });
  };
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const categoryTitle =
    category === "xe"
      ? "Xe máy điện cũ"
      : category === "pin"
      ? "Pin xe máy điện"
      : "Tất cả sản phẩm";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categoryTitle}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {filteredItems.length} sản phẩm
              </p>
            </div>
            <nav className="text-sm text-gray-500">
              <Link to="/" className="hover:text-blue-600">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">{categoryTitle}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSearch priceMin={priceMin} priceMax={priceMax} />

          {/* Main */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between p-4 mb-4 bg-white border rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Sắp xếp:
                </span>
              </div>
              <div className="flex gap-2">
                {[
                  { key: "newest", label: "Mới nhất" },
                  { key: "price-asc", label: "Giá thấp" },
                  { key: "price-desc", label: "Giá cao" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      sortBy === opt.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="py-16 text-center bg-white border rounded-lg">
                Đang tải…
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-white border rounded-lg">
                <p className="text-lg text-gray-500">Không có sản phẩm</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex gap-4 p-4 transition-shadow bg-white border rounded-lg hover:shadow-md"
                  >
                    <Link
                      to={`/marketplace/listing/${item.id}`}
                      state={{ from: location.pathname + location.search }}
                      className="shrink-0"
                    >
                      <div className="flex items-center justify-center w-48 h-32 overflow-hidden bg-gray-100 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="object-contain max-w-full max-h-full"
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <Link
                          to={`/marketplace/listing/${item.id}`}
                          state={{ from: location.pathname + location.search }}
                        >
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {item.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {currency(item.price)}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                              favorites.includes(item.id)
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.includes(item.id)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                            {favorites.includes(item.id)
                              ? "Đã thích"
                              : "Yêu thích"}
                          </button>

                          <Link
                            to={`/marketplace/listing/${item.id}`}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Infinite scroll loader */}
                {displayCount < filteredItems.length && (
                  <div ref={observerTarget} className="py-8 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-600">
                      Đang tải thêm...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
