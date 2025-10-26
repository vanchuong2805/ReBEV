// src/features/home/components/FeaturedListings.jsx
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getFeaturedProducts } from "../service";

function currency(v) {
  return typeof v === "number" ? v.toLocaleString("vi-VN") + " ₫" : v;
}
function getThumbnail(media) {
  try {
    const arr = JSON.parse(media);
    const pick = arr.find((m) => m.is_thumbnail) || arr[0];
    return pick?.url?.replace(/^(image|video)\s+/, "") || "/placeholder.webp";
  } catch {
    return "/placeholder.webp";
  }
}
function textIncludes(haystack = "", needle = "") {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export default function FeaturedListings() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // nhận page/limit/search từ URL (client-side pagination)
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // gọi API 1 lần
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await getFeaturedProducts();
        const list = Array.isArray(res) ? res : res?.data;
        setAllItems(list);
      } catch (e) {
        console.error("Fetch posts failed:", e);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 1) lọc Approved
  const approved = useMemo(
    () => allItems.filter((p) => p?.status === 1),
    [allItems]
  );

  // 2) lọc search theo title/description
  const searched = useMemo(() => {
    if (!search) return approved;
    return approved.filter(
      (p) =>
        textIncludes(p?.title || "", search) ||
        textIncludes(p?.description || "", search)
    );
  }, [approved, search]);

  // 3) phân trang client
  const total = searched.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * limit;
  const displayItems = searched.slice(start, start + limit);

  const goToPage = (nextPage) => {
    const np = Math.min(Math.max(nextPage, 1), totalPages);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(np));
    next.set("limit", String(limit));
    if (search) next.set("search", search);
    else next.delete("search");
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // build dải trang gọn (1 ... n)
  const pages = useMemo(() => {
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    const range = [];
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    return [1, ...range, totalPages];
  }, [currentPage, totalPages]);

  return (
    <section className="container mx-auto mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-semibold">Tất cả bài đăng</h2>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Đang tải…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayItems.map((it) => (
              <Link
                key={it.id}
                to={`/marketplace/listing/${it.id}`}
                state={{ from: location.pathname + location.search }}
                className="transition-shadow bg-white border rounded-xl hover:shadow-custom-md"
              >
                <div className="relative">
                  <img
                    src={getThumbnail(it.media)}
                    alt={it.title}
                    className="object-cover w-full h-40 rounded-t-xl"
                    loading="lazy"
                  />
                  <button
                    aria-label="Yêu thích"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="w-4 h-4 text-gray-800" />
                  </button>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-800 line-clamp-2">
                    {it.title}
                  </div>
                  <div className="mt-1 font-semibold text-red-600">
                    {currency(it.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination client-side */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
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
                      p === currentPage
                        ? "bg-[#007BFF] text-white shadow-md scale-105 transition"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
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
