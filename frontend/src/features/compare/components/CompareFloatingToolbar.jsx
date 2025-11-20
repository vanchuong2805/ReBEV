import React from "react";
import { useNavigate } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { toast } from "sonner";

function currency(v) {
  return Number(v || 0).toLocaleString("vi-VN") + " ₫";
}

export default function CompareFloatingToolbar({
  compareList,
  setCompareList,
}) {
  const navigate = useNavigate();

  const removeFromCompare = (itemId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== itemId));
    toast.info("Đã xóa khỏi danh sách so sánh");
  };

  const handleCompare = () => {
    if (compareList.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để so sánh");
      return;
    }
    const ids = compareList.map((p) => p.id).join(",");
    navigate(`/marketplace/compare?ids=${ids}`);
  };

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
      <div className="container px-4 py-4 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-start w-full gap-4 md:flex-row md:w-auto">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GitCompare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">
                  So sánh ({compareList.length}/4)
                </span>
                <p className="hidden text-xs text-gray-600 md:block">
                  {compareList.length === 0
                    ? "Chưa có sản phẩm nào"
                    : `Đã chọn ${compareList.length} sản phẩm`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap w-full gap-3 md:w-auto">
              {compareList.map((item) => (
                <div
                  key={item.id}
                  className="relative flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg group min-w-[200px] hover:shadow-md transition-all"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCompare(item.id);
                    }}
                    className="absolute z-50 flex items-center justify-center w-6 h-6 text-white transition-all bg-red-500 rounded-full shadow-lg -top-2 -right-2 hover:bg-red-600 hover:scale-110"
                    title="Xóa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-12 h-12 border-2 border-white rounded shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs font-bold text-blue-600">
                      {currency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full gap-3 md:w-auto">
            <button
              onClick={() => setCompareList([])}
              className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:shadow-md"
            >
              Xóa tất cả
            </button>
            <button
              onClick={handleCompare}
              disabled={compareList.length === 0}
              className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              So sánh ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
