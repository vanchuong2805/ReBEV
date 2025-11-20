// src/features/home/pages/ListingList.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Filter, GitCompare } from "lucide-react";
import { getFeaturedProducts } from "@/features/home/service";
import { toast } from "sonner";
import FilterSearch from "../components/FilterSearch";
import CompareFloatingToolbar from "@/features/compare/components/CompareFloatingToolbar";
import { useCompare } from "@/hooks/useCompare";
import ListingCard from "../components/ListingCard";

export default function ListingList() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Hook cho so sánh sản phẩm
  const {
    addToCompare,
    removeFromCompare,
    isInCompare,
    getCompareCount,
    compareList,
  } = useCompare();

  // Nếu route chứa category (ví dụ /marketplace/xe hoặc /marketplace/pin),
  // nhưng URL query chưa có `categories`, thì tự động gắn vào searchParams
  // để các component khác (và filter logic) có thể reuse param này.
  useEffect(() => {
    const cats = searchParams.get("categories");
    if (!cats) {
      let catId = null;
      if (category === "xe") catId = "1";
      else if (category === "pin") catId = "2";

      if (catId) {
        const next = new URLSearchParams(searchParams);
        next.set("categories", catId);
        setSearchParams(next, { replace: true });
      }
    }
    // only run when route category changes
  }, [category, searchParams, setSearchParams]);

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 0 });

  // Lấy search từ URL query params
  const searchFromUrl = searchParams.get("search") || "";

  // Sort + favorites
  // We'll drive sorting via URL params: order_by and order_direction
  const handleSortClick = (optKey) => {
    const params = new URLSearchParams(searchParams);
    if (optKey === "newest") {
      // For "Mới nhất" we only send the order_by (create_at).
      // Do not send order_direction so backend can use its default ordering.
      params.set("order_by", "create_at");
      params.delete("order_direction");
    } else if (optKey === "price-asc") {
      params.set("order_by", "price");
      params.set("order_direction", "ASC");
    } else if (optKey === "price-desc") {
      params.set("order_by", "price");
      params.set("order_direction", "DESC");
    }
    // reset page when sorting changes
    params.delete("page");
    setSearchParams(params, { replace: true });
  };

  const currentOrderBy = searchParams.get("order_by") || "create_at";
  const currentOrderDir = (
    searchParams.get("order_direction") || "DESC"
  ).toUpperCase();
  const currentSortKey =
    currentOrderBy === "price"
      ? currentOrderDir === "ASC"
        ? "price-asc"
        : "price-desc"
      : "newest";
  const [totalPages, setTotalPages] = useState(1);

  // Pagination from URL
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  // Load province_id từ localStorage khi component mount
  useEffect(() => {
    const savedProvinceId = localStorage.getItem("selected_province_id");
    const currentProvinceId = searchParams.get("province_id");

    if (!currentProvinceId && savedProvinceId) {
      const params = new URLSearchParams(searchParams);
      params.set("province_id", savedProvinceId);
      setSearchParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lưu province_id vào localStorage khi URL thay đổi
  useEffect(() => {
    const provinceId = searchParams.get("province_id");
    if (provinceId) {
      localStorage.setItem("selected_province_id", provinceId);
    } else {
      // Xóa khỏi localStorage khi province_id bị xóa khỏi URL
      localStorage.removeItem("selected_province_id");
    }
  }, [searchParams]);

  // Fetch API với filter params
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const queryParams = {};

        // Category từ route hoặc từ searchParams
        const categoryIds = searchParams
          .get("categories")
          ?.split(",")
          .filter(Boolean)
          .map(Number);
        if (categoryIds && categoryIds.length > 0) {
          queryParams.category_id = categoryIds[0];
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
        const minPrice = searchParams.get("min_price");
        const maxPrice = searchParams.get("max_price");
        if (minPrice) queryParams.min_price = minPrice;
        if (maxPrice) queryParams.max_price = maxPrice;

        // Province ID
        const provinceId = searchParams.get("province_id");
        if (provinceId) {
          queryParams.province_id = provinceId;
        }

        // Order params (send to backend so server does sorting)
        const orderBy = searchParams.get("order_by");
        const orderDir = searchParams.get("order_direction");
        if (orderBy) queryParams.order_by = orderBy;
        if (orderDir) queryParams.order_direction = orderDir;

        // Variation filters (supports comma-separated or repeated params)
        const variationRaw = searchParams.getAll("variation_value_id") || [];
        const variationIds = variationRaw
          .flatMap((v) => (v || "").toString().split(","))
          .map((v) => Number(v))
          .filter(Boolean);
        if (variationIds.length > 0) {
          // send as array so axios/express will parse to an array on the server
          queryParams.variation_value_id = variationIds;
        }

        // Status - chỉ lấy approved
        queryParams.status = 1;

        // Ensure we only request visible, non-deleted posts
        queryParams.is_deleted = false;
        queryParams.is_hidden = false;

        // include pagination params so backend returns paginated data
        queryParams.page = page;
        queryParams.limit = limit;

        // iUser_id - BE sẽ loại bỏ posts của user này
        const userRaw = localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        if (user?.id) {
          queryParams.iUser_id = user.id;
        }

        console.log("🔍 Fetching with params:", queryParams);

        const res = await getFeaturedProducts(queryParams);
        // API may return paginated shape: { data: [...], pagination: { total, limit, page } }
        const list = res?.data || (Array.isArray(res) ? res : []);

        const normalized = (list || []).map((p) => ({
          ...p,
          created_at: p.create_at || p.created_at || null,
        }));

        setAllItems(normalized);

        // Lưu priceRange từ API
        if (res?.priceRange) {
          setPriceRange({
            minPrice: res.priceRange.minPrice || 0,
            maxPrice: res.priceRange.maxPrice || 0,
          });
        }

        const calculatedTotalPages = res?.pagination
          ? Math.ceil(res.pagination.total / res.pagination.limit)
          : 1;
        setTotalPages(calculatedTotalPages);
      } catch (e) {
        console.error(e);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, searchParams, searchFromUrl, page, limit]);

  // Do not sort client-side: ordering is handled by the backend via
  // order_by / order_direction params. Keep server-provided order.
  const filteredItems = useMemo(() => {
    return [...allItems];
  }, [allItems]);

  // Sử dụng priceRange từ API thay vì tính từ filteredItems
  const priceMin = priceRange.minPrice;
  const priceMax = priceRange.maxPrice;

  // Server-side pagination: displayItems are the items returned for current page
  const displayItems = filteredItems;

  const goToPage = (nextPage) => {
    const np = Math.min(Math.max(nextPage, 1), totalPages);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(np));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // build condensed page range
  const pages = useMemo(() => {
    if (totalPages === 1) return [1];

    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    const range = [];

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) range.push(i);
    }
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);
    return range;
  }, [page, totalPages]);

  // Debug helper: log duplicate keys if any (helps trace React key warnings)
  useEffect(() => {
    try {
      const ids = displayItems.map((d) => d.id);
      const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
      if (dupIds.length > 0)
        console.warn("Duplicate item ids in ListingList:", dupIds);

      const dupPages = pages.filter((v, i) => pages.indexOf(v) !== i);
      if (dupPages.length > 0)
        console.warn("Duplicate page entries in pagination:", dupPages);
    } catch {
      /* ignore */
    }
  }, [displayItems, pages]);

  // Handler cho so sánh sản phẩm
  const toggleCompare = (item) => {
    if (isInCompare(item.id)) {
      removeFromCompare(item.id);
      toast.info("Đã xóa khỏi danh sách so sánh");
    } else {
      if (getCompareCount() >= 4) {
        toast.error("Chỉ có thể so sánh tối đa 4 sản phẩm");
        return;
      }
      addToCompare(item.id);
      toast.success("Đã thêm vào danh sách so sánh");
    }
  };

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
          <FilterSearch priceMax={priceMax} priceMin={priceMin} />

          {/* Main */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between p-4 mb-4 bg-white border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Sắp xếp:
                  </span>
                </div>
                {compareList.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 text-blue-700 bg-blue-100 rounded-full">
                    <GitCompare className="w-4 h-4" />
                    <span className="text-xs font-semibold">
                      {compareList.length} đang so sánh
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {[
                  { key: "newest", label: "Mới nhất" },
                  { key: "price-asc", label: "Giá thấp tới cao" },
                  { key: "price-desc", label: "Giá cao tới thấp" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSortClick(opt.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentSortKey === opt.key
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
                {displayItems.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="relative">
                    {/* Wrapper để thêm ring khi được chọn so sánh */}
                    <div
                      className={`rounded-lg ${
                        compareList.some((p) => p.id === item.id)
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : ""
                      }`}
                    >
                      <ListingCard item={item} />
                    </div>

                    {/* Nút so sánh overlay */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompare(item);
                      }}
                      className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shadow-sm z-10 ${
                        isInCompare(item.id)
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      {isInCompare(item.id) ? "Đã chọn" : "So sánh"}
                    </button>
                  </div>
                ))}

                {/* Pagination (server-side) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                      ‹
                    </button>

                    {pages.map((p, i) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="px-3 text-gray-400 select-none"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={`page-${p}-${i}`}
                          onClick={() => goToPage(p)}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            p === page
                              ? "bg-[#007BFF] text-white shadow-md scale-105 transition"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Toolbar */}
      <CompareFloatingToolbar compareList={compareList} />
    </div>
  );
}
