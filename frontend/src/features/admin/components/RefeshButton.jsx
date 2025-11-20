import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";

// Simple refresh button (Metronic style) with optional callback
// Props:
// - onRefresh: function to run instead of full page reload
// - label: custom button text
// - className: extra tailwind classes
export default function RefeshButton({
  onRefresh,
  label = "Làm mới",
  className = "",
}) {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);

  const handleClick = async () => {
    try {
      setSpinning(true);
      if (typeof onRefresh === "function") {
        await Promise.resolve(onRefresh());
        setTimeout(() => setSpinning(false), 300); // nhẹ để thấy animation
      } else {
        // Full page reload via react-router v6 navigate(0)
        navigate(0);
      }
    } catch {
      setSpinning(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={spinning}
      className={[
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400",
        "text-white text-sm font-medium shadow-sm",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ",
        className,
      ].join(" ")}
    >
      <RotateCcw size={16} className={spinning ? "animate-spin" : ""} />
      <span>{label}</span>
    </button>
  );
}
