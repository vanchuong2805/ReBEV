import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { DEMO } from "../../../data";

function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function PromotionBanner() {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 5; // số lượng hiển thị cùng lúc
  const totalItems = DEMO.length;
  const totalSteps = totalItems - visibleCount + 1;

  // Auto slide 1 item mỗi 3s
  useEffect(() => {
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
          {DEMO.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-1/5 p-3" // 1/5 = 20%
            >
              <Link
                to={`/marketplace/listing/${item.id}`}
                state={{ from: location.pathname + location.search }}
                className="block overflow-hidden transition-shadow bg-white border rounded-xl hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 object-cover w-full h-full"
                    loading="lazy"
                  />
                  <button
                    aria-label="Yêu thích"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="w-4 h-4 text-gray-800" />
                  </button>
                  {item.badge && (
                    <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
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
        </div>
      </div>
    </section>
  );
}
