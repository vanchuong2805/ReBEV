// components/shared/FilterBar.jsx
import { Search, Filter as FilterIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FilterBar({
  setFilSearch,
  filSearch = {},
  searchPlaceholder = "Tìm kiếm...",
  selects = [],
  showFilterIcon = true,
  className = "",
}) {
  // State tạm để gõ chữ nhưng chưa tìm
  const [localSearch, setLocalSearch] = useState(filSearch.searchTerm || "");

  return (
    <Card className={`p-6 mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Ô search */}
        <div className="flex-1">
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

            {/* chỉ update localSearch - không gọi API */}
            <Input
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />

            {/* Nút tìm kiếm */}
            <Button
              onClick={() =>
                setFilSearch((pre) => ({
                  ...pre,
                  searchTerm: localSearch, // gửi text vào state chính
                }))
              }
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Các select */}
        <div className="flex flex-wrap items-center gap-4">
          {selects.map((sel) => (
            <div key={sel.key} className="flex items-center space-x-2">
              {showFilterIcon && (sel.showIcon ?? true) && (
                <FilterIcon className="h-4 w-4 text-gray-400" />
              )}

              <select
                value={sel.value}
                onChange={(e) => {
                  const v = e.target.value;

                  // update cho parent nếu có
                  if (typeof sel.onChange === "function") {
                    sel.onChange(v);
                  }

                  // cập nhật vào filSearch -> gọi API
                  setFilSearch((pre) => ({
                    ...pre,
                    [sel.key]: v || "",
                  }));
                }}
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

      </div>
    </Card>
  );
}
