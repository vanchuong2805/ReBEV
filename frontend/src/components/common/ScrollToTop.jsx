// src/components/common/ScrollToTop.jsx
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300); // hiện nút khi cuộn xuống 300px
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // cuộn mượt
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed z-50 flex items-center justify-center w-10 h-10 text-white transition-all bg-blue-600 rounded-full shadow-md bottom-22 right-1 hover:bg-blue-700"
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    )
  );
}
