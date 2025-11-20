import React from "react";

export default function Pagination({
  length,
  current,
  onChange,
  canNext,
  canPrev,
}) {
  // Tổng số trang. Fallback nếu không truyền length: ước lượng current + 1 nếu có trang sau
  const total =
    Number.isFinite(Math.ceil(length)) && Math.ceil(length) > 0
      ? Math.ceil(length)
      : current + (canNext ? 1 : 0);

  // Tạo danh sách trang hiển thị có '...'
  const buildPages = (t, c) => {
    if (!t || t <= 1) return [1];
    if (t <= 5) return Array.from({ length: t }, (_, i) => i + 1);

    // t >= 6: dùng dạng [1, ..., c-1,c,c+1, ..., t]
    if (c <= 3) return [1, 2, 3, "...", t];
    if (c >= t - 2) return [1, "...", t - 2, t - 1, t];
    return [1, "...", c - 1, c, c + 1, "...", t];
  };

  const pages = buildPages(total, current);

  return (
    <div className="flex items-center gap-2 mt-6 select-none">
      <button
        disabled={!canPrev}
        onClick={() => canPrev && onChange(current - 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition shadow-sm ${
          canPrev
            ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
        }`}
      >
        <span>&lt;</span>
      </button>
      {pages.map((p, idx) => {
        const isDots = p === "...";
        return isDots ? (
          <span
            key={`dots-${idx}`}
            className="w-10 h-10 inline-flex items-center justify-center rounded-md text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-semibold transition shadow-sm ${
              p === current
                ? "bg-blue-600 text-white border-blue-600 shadow-blue-100"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        );
      })}
      <button
        disabled={!canNext}
        onClick={() => canNext && onChange(current + 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition shadow-sm ${
          canNext
            ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
        }`}
      >
        <span>&gt;</span>
      </button>
    </div>
  );
}
