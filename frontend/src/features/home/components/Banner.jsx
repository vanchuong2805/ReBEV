import { useState, useEffect } from "react";

function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Mảng chứa thông tin cho mỗi slide
  const slides = [
    {
      image:
        "https://res.cloudinary.com/du261e4fa/image/upload/v1762088599/xe-may-dien-honda-em1-e-4-1683953610174949982262_ooi4ms.jpg",
      title: "Chào mừng đến với ReBEV",
      description: "Nền tảng mua bán xe máy điện uy tín hàng đầu Việt Nam",
    },
    {
      image:
        "https://res.cloudinary.com/du261e4fa/image/upload/v1761937626/0455_a1_golkls.jpg",
      title: "Xe Máy Điện Chất Lượng",
      description: "Đa dạng mẫu mã, giá cả hợp lý, giao dịch minh bạch",
    },
    {
      image:
        "https://res.cloudinary.com/du261e4fa/image/upload/v1761571325/honda-mono-xe-dien-vtbike-3_jbaoiy.webp",
      title: "Mua Bán An Toàn",
      description: "Hệ thống thanh toán bảo mật, cam kết chất lượng",
    },
    {
      image:
        "https://res.cloudinary.com/du261e4fa/image/upload/v1761792481/xe-may-dien-espero-diamond-plus-mau-tra-sua-2_hh7m5j.webp",
      title: "Giao Dịch Nhanh Chóng",
      description: "Đặt cọc online, giao xe tận nơi, hỗ trợ 24/7",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Chuyển slide mỗi 4 giây

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Bật lại autoplay sau 10 giây
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden bg-gray-900 group">
      {/* Aspect ratio container */}
      <div className="relative w-full" style={{ paddingBottom: "40%" }}>
        {/* Images */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* Text Content */}
              <div
                className={`absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-24 transition-all duration-700 delay-300 ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <div className="max-w-2xl">
                  <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-2xl">
                    {slide.title}
                  </h2>
                  <p className="text-lg font-medium text-gray-200 md:text-xl lg:text-2xl drop-shadow-lg">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute z-10 p-3 text-gray-800 transition-all duration-300 -translate-y-1/2 rounded-full shadow-lg opacity-0 left-4 top-1/2 bg-white/80 hover:bg-white group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute z-10 p-3 text-gray-800 transition-all duration-300 -translate-y-1/2 rounded-full shadow-lg opacity-0 right-4 top-1/2 bg-white/80 hover:bg-white group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6"
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
        </button>

        {/* Dots Indicators */}
        <div className="absolute z-10 flex gap-3 -translate-x-1/2 bottom-6 left-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute px-4 py-2 text-sm font-medium text-white rounded-full top-6 right-6 bg-black/50 backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}

export default Banner;
