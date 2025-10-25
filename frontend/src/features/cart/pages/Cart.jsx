import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { ShoppingCart, Trash2 } from "lucide-react";

export default function Cart() {
  // Giả sử useCart đã được cập nhật để cung cấp các hàm và state mới
  const {
    items,
    update,
    remove,
    selectedItems, // Mảng các item đã được chọn
    toggleSelection, // Hàm để chọn/bỏ chọn một item
    toggleAllSelection, // Hàm để chọn/bỏ chọn tất cả
    isAllSelected, // Boolean kiểm tra tất cả đã được chọn chưa
    clearSelected, // Hàm xóa các item đã chọn
    selectedTotal, // Tổng tiền của các item đã chọn
  } = useCart();

  // Giao diện khi giỏ hàng trống
  if (!items || items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center px-4 py-16 mx-auto text-center">
        <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="mb-6 text-gray-500">
          Hãy bắt đầu lựa chọn những sản phẩm tuyệt vời nhé!
        </p>
        <Link
          to="/marketplace"
          className="px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-gray-50">
      {" "}
      {/* Thêm padding bottom để summary không che mất nội dung */}
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Giỏ hàng</h1>

        <div className="bg-white rounded-lg shadow-md">
          {/* Header của bảng sản phẩm */}
          <div className="flex items-center p-4 text-sm font-semibold text-gray-600 border-b">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={isAllSelected}
              onChange={(e) => toggleAllSelection(e.target.checked)}
            />
            <span className="flex-grow ml-4">
              Chọn tất cả ({items.length} sản phẩm)
            </span>
            <button
              onClick={clearSelected}
              className="flex items-center text-red-500 hover:underline"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa mục đã chọn
            </button>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQtyChange={update}
                onRemove={remove}
                onToggleSelection={toggleSelection}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Thanh Summary cố định ở dưới */}
      <CartSummary
        selectedCount={selectedItems.length}
        total={selectedTotal}
        onSelectAll={toggleAllSelection}
        isAllSelected={isAllSelected}
      />
    </div>
  );
}
