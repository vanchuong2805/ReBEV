// FilterSection - Component cho mỗi section filter
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function FilterSection({
  title,
  items = [],
  selectedValues = [],
  onToggle,
  filterKey,
  isOpen,
  onToggleSection,
  maxHeight = "max-h-60",
}) {
  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden bg-white border rounded-lg">
      <button
        onClick={onToggleSection}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition"
      >
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
          {selectedValues.length > 0 && (
            <span className="ml-2 text-xs text-blue-600">
              ({selectedValues.length})
            </span>
          )}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className={`px-4 pb-4 space-y-3 ${maxHeight} overflow-y-auto`}>
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${filterKey}-${item.id}`}
                checked={selectedValues.includes(item.value)}
                onCheckedChange={() => onToggle(filterKey, item.value)}
              />
              <Label
                htmlFor={`${filterKey}-${item.id}`}
                className="text-sm cursor-pointer"
              >
                {item.value}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
