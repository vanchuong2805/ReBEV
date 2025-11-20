// src/components/common/MyInputPlus.jsx
// Input component dùng chung cho các variation field:
// - Hỗ trợ danh sách chọn (dropdown) hoặc nhập tay (free text)
// - Nếu có options -> hiện dropdown để chọn
// - Nếu không có options -> cho phép gõ tự do (vd: Biển số, số km...)
// - Không sort lại theo alphabet, giữ nguyên thứ tự trong DB

import React, { useEffect, useMemo, useRef, useState } from "react";

export function MyInput({
  options = [], // mảng [{ id, value, label }] hoặc string
  value = "",
  onChange, // callback khi giá trị thay đổi
  placeholder = "Chọn...",
  allowFreeText = false, // mặc định không cho gõ, chỉ bật khi không có options
  parseOption = (opt) => ({
    id: opt?.id,
    value: typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? "",
    label: typeof opt === "string" ? opt : opt?.label ?? opt?.value ?? "",
  }),
  className = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);

  const parsed = useMemo(
    () => options.map(parseOption),
    [options, parseOption]
  );

  // Lọc theo từ khoá tìm kiếm trong dropdown
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parsed;
    return parsed.filter((o) => o.label.toLowerCase().includes(q));
  }, [parsed, query]);

  // Lấy nhãn hiển thị (khi chọn hoặc gõ)
  const selectedLabel = useMemo(() => {
    const found = parsed.find((o) => o.value === value || o.label === value);
    if (found) return found.label;
    // Nếu không có trong danh sách và được phép gõ -> hiển thị chính giá trị đang gõ
    return allowFreeText && typeof value === "string" ? value : "";
  }, [parsed, value, allowFreeText]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handlePick(opt) {
    setOpen(false);
    onChange && onChange(opt.value);
  }

  const hasOptions = parsed.length > 0;

  return (
    <div
      className={`relative w-full ${disabled ? "opacity-60" : ""}`}
      ref={boxRef}
    >
      <input
        type="text"
        value={selectedLabel}
        placeholder={placeholder}
        onClick={() => !disabled && hasOptions && setOpen((o) => !o)}
        readOnly={!allowFreeText}
        onChange={(e) => {
          if (allowFreeText) onChange && onChange(e.target.value);
        }}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        disabled={disabled}
      />

      {/* Dropdown */}
      {open && hasOptions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
            />
          </div>
          <div className="overflow-y-auto max-h-60">
            {list.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không có dữ liệu
              </div>
            )}
            {list.map((o) => (
              <div
                key={`${o.id ?? o.value}`}
                onClick={() => handlePick(o)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {o.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
