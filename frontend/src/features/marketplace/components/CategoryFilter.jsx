// CategoryFilter - Component cho category selection
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CategoryFilter({
  selectedCategories,
  onCategoryChange,
  isOpen,
  onToggleSection,
}) {
  return (
    <div className="overflow-hidden bg-white border rounded-lg">
      <button
        onClick={onToggleSection}
        className="flex items-center justify-between w-full p-4 transition hover:bg-gray-50"
      >
        <h3 className="text-sm font-semibold text-gray-900">Danh mục</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center space-x-2">
            <input
              id="category-1"
              name="categories"
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              checked={selectedCategories.includes(1)}
              onChange={() => onCategoryChange(1)}
            />
            <Label htmlFor="category-1" className="text-sm cursor-pointer">
              Xe máy điện cũ
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="category-2"
              name="categories"
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              checked={selectedCategories.includes(2)}
              onChange={() => onCategoryChange(2)}
            />
            <Label htmlFor="category-2" className="text-sm cursor-pointer">
              Pin EV cũ
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
