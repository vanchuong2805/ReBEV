import React from "react";
import { Trash2 } from "lucide-react";

const formatCurrency = (amount) => {
  return (amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export default function CartItem({
  item,
  onQtyChange,
  onRemove,
  onToggleSelection,
}) {
  const handleQuantityChange = (newQty) => {
    if (newQty >= 1) {
      onQtyChange(item.id, newQty);
    }
  };

  return (
    <div className="flex items-center p-4 border-b last:border-b-0">
      <input
        type="checkbox"
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        checked={item.selected || false}
        onChange={() => onToggleSelection(item.id)}
      />

      {/* Thông tin sản phẩm */}
      <div className="flex items-center flex-grow gap-4 ml-4">
        <img
          src={item.image}
          alt={item.title}
          className="object-cover w-20 h-20 border rounded-md"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800 line-clamp-2">
            {item.title}
          </p>
          <p className="mt-1 text-gray-600 lg:hidden">
            {formatCurrency(item.price)}
          </p>
        </div>
      </div>

      {/* Các cột cho màn hình lớn */}
      <div className="items-center hidden gap-8 ml-4 lg:flex">
        <div className="w-24 text-center text-gray-600">
          {formatCurrency(item.price)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.qty - 1)}
            className="border rounded-md w-7 h-7 hover:bg-gray-100"
          >
            -
          </button>
          <input
            type="number"
            value={item.qty}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="w-12 text-center border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => handleQuantityChange(item.qty + 1)}
            className="border rounded-md w-7 h-7 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <div className="w-24 font-semibold text-right text-red-500">
          {formatCurrency(item.price * item.qty)}
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-gray-500 hover:text-red-600"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Bố cục số lượng cho màn hình nhỏ */}
      <div className="flex flex-col items-end lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.qty - 1)}
            className="border rounded-md w-7 h-7 hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-8 font-semibold text-center">{item.qty}</span>
          <button
            onClick={() => handleQuantityChange(item.qty + 1)}
            className="border rounded-md w-7 h-7 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
