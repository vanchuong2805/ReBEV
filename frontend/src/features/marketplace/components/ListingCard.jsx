import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, MapPin, Store, Sparkles } from "lucide-react";
import { useFavorite } from "@/contexts/FavoritesContexts.jsx";
import { getBases } from "../service";

function currency(v) {
  return v.toLocaleString("vi-VN") + " ₫";
}

function getMediaArray(media) {
  try {
    return typeof media === "string" ? JSON.parse(media) : media || [];
  } catch {
    return [];
  }
}

export default function ListingCard({ item }) {
  const { isFavorite, toggleFavorite } = useFavorite();
  const [bases, setBases] = useState([]);
  const isHighlight = item?.user?.package?.highlight === true;
  const sellerName = item?.user?.display_name || "Người bán";

  useEffect(() => {
    const fetchBases = async () => {
      const bases = await getBases();
      setBases(bases);
    };
    fetchBases();
  }, []);

  const baseInfo = bases.find((b) => b.id === item.base_id);

  // Lấy danh sách ảnh
  const mediaArray = getMediaArray(item.media);
  const images = mediaArray
    .filter((m) => m.url?.startsWith("image"))
    .map((m) => m.url.replace(/^image\s+/, ""));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slide images cho highlight posts
  useEffect(() => {
    if (!isHighlight || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Đổi ảnh mỗi 3 giây

    return () => clearInterval(interval);
  }, [isHighlight, images.length]);

  const currentImage =
    images[currentImageIndex] || item.image || "/placeholder.webp";

  return (
    <>
      <Link to={`/marketplace/listing/${item.id}`}>
        <div
          className={`relative flex gap-4 p-4 transition-all bg-white rounded-lg hover:shadow-lg ${
            isHighlight
              ? "border-2 border-amber-400 shadow-amber-100 shadow-md"
              : "border border-gray-200"
          }`}
        >
          {/* Highlight badge */}
          {isHighlight && (
            <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full shadow-sm text-amber-700 bg-gradient-to-r from-amber-200 to-yellow-200 -top-2 -right-2">
              <Sparkles className="w-3 h-3" />
              Nổi bật
            </div>
          )}

          <Link
            to={`/marketplace/listing/${item.id}`}
            className="relative shrink-0"
          >
            <div className="relative w-48 h-32 overflow-hidden rounded-lg">
              <img
                src={currentImage}
                alt={item.title}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
              {/* Indicator dots for highlight posts with multiple images */}
              {isHighlight && images.length > 1 && (
                <div className="absolute flex gap-1 px-2 py-1 transform -translate-x-1/2 rounded-full bg-black/50 bottom-2 left-1/2 backdrop-blur-sm">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "bg-white w-4"
                          : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <Link to={`/marketplace/listing/${item.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                  {item.title}
                </h3>
              </Link>

              {/* Seller info */}
              <Link to={`/shop/${item.user.id}`}>
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-600">
                  <Store className="w-3.5 h-3.5" />
                  <span className="font-medium">{sellerName}</span>
                </div>
              </Link>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                {item.badge && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                    {item.badge}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {item.created_at.split("T")[0]}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {baseInfo ? baseInfo.name : "Địa chỉ không xác định"}
                </span>
                {console.log(item)}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className={`text-2xl font-bold text-red-600`}>
                {currency(item.price)}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isFavorite(item.id)
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(item.id) ? "fill-current" : ""
                    }`}
                  />
                  {isFavorite(item.id) ? "Đã thích" : "Yêu thích"}
                </button>

                <Link
                  to={`/marketplace/listing/${item.id}`}
                  className={`px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg ${
                    isHighlight
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
