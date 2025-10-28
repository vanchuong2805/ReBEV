import React from "react";
import { Link } from "react-router-dom";

export default function CartSummary({
  total,
  onSelectAll,
  isAllSelected,
}) {
  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleSelectAllChange = (e) => {
    onSelectAll(e.target.checked);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t shadow-lg">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Phần bên trái: Chọn tất cả */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="select-all"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
            />
            <label htmlFor="select-all" className="ml-3 text-gray-700">
              Chọn tất cả
            </label>
          </div>

          {/* Phần bên phải: Tổng tiền và nút Thanh toán */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-600">
                Tạm tính:
              </span>
              <span className="ml-2 text-2xl font-bold text-red-600">
                {formatCurrency(total)}
              </span>
            </div>
            <Link
              to="/checkout"
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                total > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              // Vô hiệu hóa nút nếu không có sản phẩm nào được chọn
              onClick={(e) => total === 0 && e.preventDefault()}
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
