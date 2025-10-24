import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Heart, Search, Filter, X, MapPin, Calendar } from "lucide-react";
import { DEMO } from "@/data";
import { toast } from "sonner";

function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function ListingList() {
  const location = useLocation();
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [displayCount, setDisplayCount] = useState(10);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200_000_000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [hasVerified, setHasVerified] = useState(false);

  const observerTarget = useRef(null);

  // Lọc data theo category
  const baseItems = useMemo(() => {
    if (category === "xe") return DEMO.filter((x) => x.category_id === 1);
    if (category === "pin") return DEMO.filter((x) => x.category_id === 2);
    return DEMO;
  }, [category]);

  // Extract brands
  const brands = useMemo(() => {
    const set = new Set();
    baseItems.forEach((x) => {
      const brand = x.title.split(" ")[0];
      if (brand) set.add(brand);
    });
    return Array.from(set).sort();
  }, [baseItems]);

  // Lọc và sắp xếp sản phẩm
  const filteredItems = useMemo(() => {
    let items = baseItems;

    // Tìm kiếm
    if (searchTerm.trim()) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc giá
    items = items.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Lọc thương hiệu
    if (selectedBrands.length > 0) {
      items = items.filter((item) =>
        selectedBrands.some((brand) => item.title.startsWith(brand))
      );
    }

    // Lọc đã kiểm định
    if (hasVerified) {
      items = items.filter((item) => item.badge === "ĐÃ KIỂM ĐỊNH");
    }

    // Sắp xếp
    if (sortBy === "price-asc") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      items = [...items].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    return items;
  }, [baseItems, searchTerm, priceRange, selectedBrands, hasVerified, sortBy]);

  // Infinite scroll
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
          {/* Sidebar */}
          <aside className="hidden w-64 space-y-6 lg:block shrink-0">
            {/* Search */}
            <div className="p-4 bg-white border rounded-lg">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Tìm kiếm
              </h3>
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập từ khóa..."
                  className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="p-4 bg-white border rounded-lg">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Khoảng giá
              </h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Brand */}
            {brands.length > 0 && (
              <div className="p-4 bg-white border rounded-lg">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Thương hiệu
                </h3>
                <div className="space-y-2 overflow-y-auto max-h-48">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedBrands([...selectedBrands, brand]);
                          else
                            setSelectedBrands(
                              selectedBrands.filter((b) => b !== brand)
                            );
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Verified */}
            <div className="p-4 bg-white border rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVerified}
                  onChange={(e) => setHasVerified(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-900">
                  Đã kiểm định
                </span>
              </label>
            </div>
          </aside>

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
            {filteredItems.length === 0 ? (
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
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-48 h-32 rounded-lg"
                      />
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

                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                          {item.badge && (
                            <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                              {item.badge}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.base_name || "TP.HCM"}
                          </span>
                        </div>
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
                            to={`listing/${item.id}`}
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
