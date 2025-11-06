// PriceRangeFilter - Component cho price range slider
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

function currency(v) {
  return Number(v || 0).toLocaleString("vi-VN") + " ₫";
}

export default function PriceRangeFilter({
  priceMin,
  priceMax,
  priceRange,
  onPriceChange,
  isOpen,
  onToggleSection,
}) {
  return (
    <div className="overflow-hidden bg-white border rounded-lg">
      <button
        onClick={onToggleSection}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition"
      >
        <h3 className="text-sm font-semibold text-gray-900">Khoảng giá</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {priceMin === priceMax ? (
            <p className="text-sm text-gray-500">Không có dữ liệu giá</p>
          ) : (
            <>
              <Slider
                min={priceMin}
                max={priceMax}
                step={10000}
                value={priceRange}
                onValueChange={onPriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{currency(priceRange[0])}</span>
                <span className="text-gray-600">{currency(priceRange[1])}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
