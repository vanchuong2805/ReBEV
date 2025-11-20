import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { toast } from "sonner";
import { getPostById } from "../../marketplace/service";
import { useCompare } from "@/hooks/useCompare";

// Helper để parse media và lấy thumbnail
function getThumb(media) {
  try {
    const arr = typeof media === "string" ? JSON.parse(media) : media || [];
    const pick = arr.find((m) => m.is_thumbnail) || arr[0];
    if (!pick?.url) return "/placeholder.webp";
    return pick.url.replace(/^(image|video)\s+/, "");
  } catch {
    return "/placeholder.webp";
  }
}

export default function CompareFloatingToolbar({ compareList }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { removeFromCompare, clearCompare } = useCompare();

  // Fetch product details if compareList contains IDs
  useEffect(() => {
    const fetchProducts = async () => {
      if (!compareList || compareList.length === 0) {
        setProducts([]);
        return;
      }

      // Check if compareList contains IDs (numbers) or full objects
      const firstItem = compareList[0];
      if (typeof firstItem === "number") {
        // Fetch product details for IDs
        try {
          const productsData = await Promise.all(
            compareList.map((id) => getPostById(id))
          );
          setProducts(productsData);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      } else {
        // Already have full objects
        setProducts(compareList);
      }
    };

    fetchProducts();
  }, [compareList]);

  const handleRemoveFromCompare = (itemId) => {
    removeFromCompare(itemId);
    toast.info("Đã xóa khỏi danh sách so sánh");
  };

  const handleCompare = () => {
    if (products.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để so sánh");
      return;
    }
    const ids = products.map((p) => p.id).join(",");
    navigate(`/marketplace/compare?ids=${ids}`);
  };

  if (!compareList || compareList.length === 0) return null;

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

            <div className="grid w-full grid-cols-4 gap-3 md:w-auto">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="relative flex gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg group w-[180px] hover:shadow-md transition-all"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCompare(item.id);
                    }}
                    className="absolute z-50 flex items-center justify-center w-6 h-6 text-white transition-all bg-red-500 rounded-full shadow-lg -top-2 -right-2 hover:bg-red-600 hover:scale-110"
                    title="Xóa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={getThumb(item.media)}
                    alt={item.title}
                    className="flex-shrink-0 object-cover w-12 h-12 border-2 border-white rounded shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold text-gray-900 line-clamp-2"
                      title={item.title}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full gap-3 md:w-auto">
            <button
              onClick={() => clearCompare()}
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
