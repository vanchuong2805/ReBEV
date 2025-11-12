import React from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, MapPin } from "lucide-react";
import { useFavorite } from "@/contexts/FavoritesContexts.jsx";


function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export default function ListingCard({
  item,
  viewMode = "list",
  
}
) {
   const { isFavorite, toggleFavorite } = useFavorite();
  // List view - hiển thị theo dạng danh sách ngang
  if (viewMode === "list") {
    return (
      <div className="relative flex gap-4 p-4 transition-shadow bg-white border rounded-lg hover:shadow-lg">
        <Link to={`/listings/${item.id}`} className="shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="object-cover w-48 h-32 rounded-lg"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-col justify-between flex-1">
          <div>
            <Link to={`/listings/${item.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                {item.title}
              </h3>
            </Link>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {item.badge && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                  {item.badge}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {item.title.match(/\b(20\d{2})\b/)?.[0] || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {item.location || "Hà Nội"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-2xl font-bold text-blue-600">
              {currency(item.price)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {toggleFavorite(item.id);}}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isFavorite(item.id)
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite(item.id) ? "fill-current" : ""}`}
                />
                {isFavorite(item.id) ? "Đã thích" : "Yêu thích"}
              </button>

              <Link
                to={`/listings/${item.id}`}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view - hiển thị theo dạng lưới
  return (
    <Link
      to={`/listings/${item.id}`}
      className="transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="object-cover w-full h-48 rounded-t-xl"
          loading="lazy"
        />
        <button
          onClick={() => {toggleFavorite(item.id);}}
          aria-label="Yêu thích"
          className={`absolute right-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white transition-colors shadow-sm ${
            isFavorite(item.id) ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite(item.id) ? "fill-current" : ""}`} />
        </button>
        {item.badge && (
          <span className="absolute px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded shadow-sm left-2 top-2">
            {item.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
          {item.title}
        </h3>
        <div className="mt-2 text-lg font-bold text-blue-600">
          {currency(item.price)}
        </div>

        {item.location && (
          <p className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {item.location}
          </p>
        )}
      </div>
    </Link>
  );
}
