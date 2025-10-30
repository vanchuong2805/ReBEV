import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ColorThief from "colorthief";

export default function ListingGallery({ listing, currentImageIndex, setCurrentImageIndex }) {
  const [bgColor, setBgColor] = useState("#f3f4f6"); // nền mặc định sáng

  useEffect(() => {
    if (!listing?.media?.length) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = listing.media[currentImageIndex]?.url?.replace(/^image\s+|^video\s+/i, "");

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch {
        setBgColor("#f3f4f6");
      }
    };
  }, [listing, currentImageIndex]);

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % listing.media.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + listing.media.length) % listing.media.length);

  return (
    <div className="overflow-hidden rounded-2xl shadow-md bg-white">
      <div
        className="relative flex items-center justify-center aspect-video transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 80%)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={listing.media[currentImageIndex]?.url}
            src={listing.media[currentImageIndex]?.url?.replace(/^image\s+|^video\s+/i, "")}
            alt={listing.title}
            className="object-contain w-full h-full rounded-2xl drop-shadow-[0_0_20px_rgba(0,0,0,0.15)]"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* === Navigation Buttons === */}
        {listing.media.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm hover:bg-white/70 text-gray-800 p-2 rounded-full shadow transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm hover:bg-white/70 text-gray-800 p-2 rounded-full shadow transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* === Indicators === */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {listing.media.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i === currentImageIndex
                  ? "bg-white shadow-md scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
