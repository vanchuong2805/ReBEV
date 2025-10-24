// components/shared/FilterBar.jsx
import { Search, Filter as FilterIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  selects = [], // [{ key, value, onChange, options:[{value,label}], showIcon }]
  showFilterIcon = true,
  className = "",
}) {
  return (
    <Card className={`p-6 mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ô search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Các ô select cấu hình qua props */}
        {selects.map((sel) => (
          <div key={sel.key} className="flex items-center space-x-2">
            {showFilterIcon && (sel.showIcon ?? true) && (
              <FilterIcon className="h-4 w-4 text-gray-400" />
            )}
            <select
              value={sel.value}
              onChange={(e) => sel.onChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {sel.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
}
