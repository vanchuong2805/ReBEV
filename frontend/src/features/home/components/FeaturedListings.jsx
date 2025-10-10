// src/features/home/components/FeaturedListings.jsx
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";
import { DEMO } from "../../../data";

function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function FeaturedListings({ items = DEMO }) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 10);

  return (
    <section className="container mx-auto mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-semibold">Tất cả bài đăng</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {displayItems.map((it) => (
          <Link
            key={it.id}
            to={`/listings/${it.id}`}
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
              <div className="mt-1 text-[#007BFF] font-semibold">
                {currency(it.price)}
              </div>
              <div className="mt-1 text-xs text-gray-500">{it.meta}</div>
            </div>
          </Link>
        ))}
      </div>
      {!showAll && items.length > 10 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="bg-[#007BFF] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Xem thêm
          </button>
        </div>
      )}
    </section>
  );
}
