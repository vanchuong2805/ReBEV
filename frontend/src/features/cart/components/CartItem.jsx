import { Trash2 } from "lucide-react";
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
    <div className="relative flex items-center gap-4 p-5 mb-3 transition-all duration-200 bg-white border border-gray-200 group rounded-xl hover:shadow-md hover:border-blue-300 last:mb-0">
      {/* Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 transition-all border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-blue-400"
          checked={item.selected}
          onChange={() => toggleSelection(item.post_id)}
        />
      </div>

      {/* Image */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
        <img
          src={item.media.split(" ")[1]}
          alt={item.title}
          className="object-cover w-24 h-24 transition-transform duration-300 lg:w-28 lg:h-28 group-hover:scale-105"
        />
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100" />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600 lg:text-lg">
          {item.title}
        </h3>

        {/* Mobile Price */}
        <div className="flex items-center gap-2 mt-2 lg:hidden">
          <span className="text-lg font-bold text-red-600">
            {formatCurrency(item.price)}
          </span>
        </div>
      </div>

      {/* Desktop Price & Actions */}
      <div className="items-center hidden gap-6 lg:flex">
        {/* Price */}
        <div className="flex flex-col items-end min-w-[140px]">
          <span className="text-xl font-bold text-red-600">
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => deleteItem(item.post_id)}
          className="p-2.5 text-gray-400 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-red-50 hover:text-red-600 hover:scale-110 active:scale-95"
          aria-label="Xóa sản phẩm"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Delete Button */}
      <button
        onClick={() => deleteItem(item.post_id)}
        className="absolute p-2 text-gray-400 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm top-3 right-3 lg:hidden hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95"
        aria-label="Xóa sản phẩm"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
