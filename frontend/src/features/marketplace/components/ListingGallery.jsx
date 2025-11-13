import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function ListingGallery({ listing, currentImageIndex, setCurrentImageIndex }) {
  const [transitioning, setTransitioning] = useState(false)

  const nextImage = () => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => setTransitioning(false), 500)
    setCurrentImageIndex((i) => (i + 1) % listing.media.length)
  }

  const prevImage = () => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => setTransitioning(false), 500)
    setCurrentImageIndex((i) => (i - 1 + listing.media.length) % listing.media.length)
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <div className="relative flex items-center justify-center aspect-video bg-white transition-all duration-700 ease-in-out">
        <AnimatePresence mode="wait">
          <motion.img
            key={listing.media[currentImageIndex]?.url}
            src={listing.media[currentImageIndex]?.url?.replace(/^image\s+|^video\s+/i, "")}
            alt={listing.title}
            className="object-contain w-full h-full rounded-xl transition-transform duration-700"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* === Navigation Buttons === */}
        {listing.media.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition"
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
                  ? "bg-gray-900 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
