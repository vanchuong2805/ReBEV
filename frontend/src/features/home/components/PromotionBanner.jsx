// src/features/home/components/PromotionBanner.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { getFeaturedProducts } from "../service";
import { useFavorite } from "@/contexts/FavoritesContexts.jsx";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";

function currency(v) {
  return typeof v === "number" ? v.toLocaleString("vi-VN") + " ₫" : v;
}

export default function PromotionBanner() {
  const { isFavorite, toggleFavorite } = useFavorite();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getThumbnail } = useCart();
  const { user } = useUser(); 
  const visibleCount = 5; // số lượng hiển thị cùng lúc

  // Gọi API 1 lần, lọc Approved (status === 1) và ẩn bài đăng của  mình
  useEffect(() => {
    (async () => {
      try {
        const res = await getFeaturedProducts();
        const list = Array.isArray(res) ? res : res?.data || [];
        let approved = list.filter((p) => p?.status === 1);

        // Ẩn bài đăng của user đang đăng nhập
        if (user?.id) {
          approved = approved.filter((p) => p?.user_id !== user.id);
        }

        setItems(approved);
      } catch (e) {
        console.error("Fetch posts failed:", e);
        setItems([]);
      }
    })();
  }, [user?.id]);

  const totalItems = items.length;
  const totalSteps = Math.max(1, totalItems - visibleCount + 1);

  // Auto slide 1 item mỗi 3s (chỉ chạy khi đủ item để trượt)
  useEffect(() => {
    if (totalSteps <= 1) {
      setCurrentIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= totalSteps - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSteps]);

  return (
    <section className="container mx-auto mt-8">
      <div className="relative overflow-hidden shadow-md bg-gray-50 rounded-xl">
        {/* Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-1/5 p-3">
              <Link
                to={`/marketplace/listing/${item.id}`}
                state={{ from: location.pathname + location.search }}
                className="block overflow-hidden transition-all duration-300 transform bg-white border border-gray-200 group rounded-xl hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={getThumbnail(item.media)}
                      alt={item.title}
                      className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-100" />
                  </div>

                  {/* Favorite button */}
                  <button
                    aria-label="Yêu thích"
                    className="absolute p-2 transition-all duration-200 rounded-full shadow-lg right-3 top-3 bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isFavorite(item.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[40px]">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-red-600">
                        {currency(item.price)}
                      </span>
                    </div>

                    {/* View detail button */}
                    <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <span className="inline-flex items-center text-xs font-medium text-blue-600">
                        Xem
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
            </div>
          ))}

          {/* Khi ít hơn visibleCount item, thêm “ghost” để đủ track (giữ layout mượt) */}
          {totalItems > 0 &&
            totalItems < visibleCount &&
            Array.from({ length: visibleCount - totalItems }).map((_, i) => (
              <div
                key={`ghost-${i}`}
                className="flex-shrink-0 w-1/5 p-3 opacity-0"
              >
                <div className="h-full bg-transparent rounded-xl" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
