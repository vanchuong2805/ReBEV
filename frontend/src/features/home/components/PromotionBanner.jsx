// src/features/home/components/PromotionBanner.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { getFeaturedProducts} from "../service"; // dùng service gọi GET /posts
import { useFavorite } from "@/contexts/FavoritesContexts.jsx";

function currency(v) {
  return typeof v === "number" ? v.toLocaleString("vi-VN") + " ₫" : v;
}

function getThumbnail(media) {
  // media là chuỗi JSON: [{ url: "image https://...", is_thumbnail: true }, ...]
  try {
    const arr = JSON.parse(media);
    const pick = arr.find((m) => m.is_thumbnail) || arr[0];
    return pick?.url?.replace(/^(image|video)\s+/, "") || "/placeholder.webp";
  } catch {
    return "/placeholder.webp";
  }
}



export default function PromotionBanner() {
  const { isFavorite, toggleFavorite } = useFavorite();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 5; // số lượng hiển thị cùng lúc

  // Gọi API 1 lần, lọc Approved (status === 1)
  useEffect(() => {
    (async () => {
      try {
        const res = await getFeaturedProducts();
        const list = Array.isArray(res) ? res : res?.data || [];
        const approved = list.filter((p) => p?.status === 1);
        setItems(approved);
      } catch (e) {
        console.error("Fetch posts failed:", e);
        setItems([]);
      }
    })();
  }, []);

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
                className="block overflow-hidden transition-shadow bg-white border rounded-xl hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={getThumbnail(item.media)}
                    alt={item.title}
                    className="absolute inset-0 object-cover w-full h-full"
                    loading="lazy"
                  />
                  <button
                    aria-label="Yêu thích"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 fill-current ${isFavorite(item.id) ? "text-red-500" : "text-gray-400"
                        }`}
                    />
                  </button>
                </div>

                <div className="p-3">
                  <div className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.title}
                  </div>
                  <div className="mt-1 font-semibold text-red-600">
                    {currency(item.price)}
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
