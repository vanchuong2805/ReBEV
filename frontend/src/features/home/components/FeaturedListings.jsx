import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { DEMO } from "../../../data";

function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function FeaturedListings({ items = DEMO }) {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(items.length / itemsPerPage);

  //  Sản phẩm của trang hiện tại
  const displayItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [currentPage, items]);

  //  Hàm chuyển trang
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //  Tạo danh sách trang hiển thị (với "..." nếu cần)
  const getPaginationRange = () => {
    const delta = 2; // số trang mỗi bên
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    return [1, ...range, totalPages];
  };

  const pages = getPaginationRange();

  return (
    <section className="container mx-auto mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-semibold">Tất cả bài đăng</h2>
      </div>

      {/* Grid hiển thị sản phẩm */}
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
                src={it.image}
                alt={it.title}
                className="object-cover w-full h-40 rounded-t-xl"
                loading="lazy"
              />
              <button
                aria-label="Yêu thích"
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white"
              >
                <Heart className="w-4 h-4 text-gray-800" />
              </button>
              {it.badge && (
                <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {it.badge}
                </span>
              )}
            </div>

            <div className="p-3">
              <div className="text-sm font-medium text-gray-800 line-clamp-2">
                {it.title}
              </div>
              <div className="mt-1 font-semibold text-red-600">
                {currency(it.price)}{" "}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Thanh phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            ‹
          </button>

          {pages.map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-3 text-gray-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "bg-[#007BFF] text-white shadow-md scale-105 transition"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
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
    </section>
  );
}
