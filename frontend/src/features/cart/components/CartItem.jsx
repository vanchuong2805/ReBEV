import { Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const formatCurrency = (amount) => {
  return (amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export default function CartItem({ item }) {
  const { toggleSelection, deleteItem } = useCart();

  return (
    <div className="relative flex items-start gap-4 p-4 transition-all duration-200 bg-white border-b border-gray-100 group last:border-b-0 hover:bg-gray-50">
      {/* Checkbox */}
      <div className="flex items-start pt-2">
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 transition-all border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-blue-400"
          checked={item.selected}
          onChange={() => toggleSelection(item.post_id)}
        />
      </div>

      {/* Image - Clickable */}
      <Link
        to={`/marketplace/listing/${item.post_id}`}
        className="relative flex-shrink-0 overflow-hidden transition-transform duration-200 rounded-lg shadow-sm hover:scale-105"
      >
        <img
          src={item.media.split(" ")[1]}
          alt={item.title}
          className="object-cover w-20 h-20 lg:w-24 lg:h-24"
        />
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/10 group-hover:opacity-100" />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        {/* Title - Clickable */}
        <Link
          to={`/marketplace/listing/${item.post_id}`}
          className="text-sm font-semibold text-gray-900 transition-colors line-clamp-2 hover:text-blue-600 lg:text-base"
        >
          {item.title}
        </Link>

        {/* Price & Delete */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-red-600 lg:text-xl">
            {formatCurrency(item.price)}
          </span>

          <button
            onClick={() => deleteItem(item.post_id)}
            className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:bg-red-50 hover:text-red-600 active:scale-95"
            aria-label="Xóa sản phẩm"
          >
            <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
