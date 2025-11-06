// src/features/home/components/FeaturedListings.jsx
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getFeaturedProducts } from "../service";
import { useFavorite } from "@/contexts/FavoritesContexts.jsx";
import { useCart } from "@/contexts/CartContext";
import { useProductSearch } from "@/hooks/useProductSearch";

function currency(v) {
  return typeof v === "number" ? v.toLocaleString("vi-VN") + " ₫" : v;
}

export default function FeaturedListings() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getThumbnail } = useCart();

  // Sử dụng search từ zustand store thay vì URL
  const { searchQuery } = useProductSearch();

  // nhận page/limit từ URL (không lấy search từ URL nữa)
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Gọi API với pagination params - BE sẽ lọc và phân trang
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        // Tạo pagination object cho BE: { page: 1, limit: 10 }
        const pagination = {
          page,
          limit,
          ...(searchQuery && { search: searchQuery }), // Thêm search nếu có
        };

        const res = await getFeaturedProducts(pagination);

        // BE trả về: { data: [...], pagination: { page, limit, total } }
        setItems(res.data || []);
        const calculatedTotalPages = res.pagination
          ? Math.ceil(res.pagination.total / res.pagination.limit)
          : 1;
        setTotalPages(calculatedTotalPages);
      } catch (e) {
        console.error("Fetch posts failed:", e);
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, searchQuery]); // Re-fetch khi page, limit, hoặc searchQuery thay đổi

  const goToPage = (nextPage) => {
    const np = Math.min(Math.max(nextPage, 1), totalPages);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(np));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // build dải trang gọn (1 ... n)
  const pages = useMemo(() => {
    if (totalPages === 1) return [1];

    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    const range = [];

    // Thêm trang 1
    range.push(1);

    // Thêm ... nếu cần
    if (left > 2) range.push("...");

    // Thêm các trang ở giữa
    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) range.push(i);
    }

    // Thêm ... nếu cần
    if (right < totalPages - 1) range.push("...");

    // Thêm trang cuối
    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [page, totalPages]);

  const { isFavorite, toggleFavorite } = useFavorite();
  return (
    <section className="container mx-auto mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-semibold">Tất cả bài đăng</h2>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Đang tải…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((it) => (
              <Link
                key={it.id}
                to={`/marketplace/listing/${it.id}`}
                state={{ from: location.pathname + location.search }}
                className="overflow-hidden transition-all duration-300 transform bg-white border border-gray-200 group rounded-xl hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getThumbnail(it.media)}
                    alt={it.title}
                    className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-100" />

                  {/* Favorite button */}
                  <button
                    aria-label="Yêu thích"
                    className="absolute p-2 transition-all duration-200 rounded-full shadow-lg right-3 top-3 bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(it.id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isFavorite(it.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[40px]">
                    {it.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-red-600">
                        {currency(it.price)}
                      </span>
                    </div>

                    {/* View detail button */}
                    <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <span className="inline-flex items-center text-xs font-medium text-blue-600">
                        Xem chi tiết
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
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
                  <span key={i} className="px-3 text-gray-400 select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
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
        </>
      )}
    </section>
  );
}
