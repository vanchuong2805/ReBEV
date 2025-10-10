import React from "react";

export default function Gallery({ items = [], onRemove }) {
  if (!items.length) {
    return <p className="text-gray-500">Chưa có bài đăng nào.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex flex-col h-full bg-white border rounded-lg shadow-sm"
        >
          {it.image && (
            <img
              src={it.image}
              alt={it.title}
              className="object-cover w-full h-40 rounded-t-lg"
            />
          )}
          <div className="flex flex-col flex-grow p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="flex-1 mb-0 text-base font-semibold leading-tight">
                {it.title}
              </h3>
              {it.badge && (
                <span className="flex-shrink-0 px-2 py-1 ml-2 text-xs text-white bg-green-500 rounded">
                  {it.badge}
                </span>
              )}
            </div>

            {it.meta && <p className="text-sm text-gray-500">{it.meta}</p>}

            <div className="flex items-center justify-between pt-2 mt-auto">
              <strong className="text-blue-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(it.price || 0)}
              </strong>
              <button
                className="px-3 py-1 text-sm text-red-500 transition-colors border border-red-500 rounded hover:bg-red-50"
                onClick={() => onRemove?.(it.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
