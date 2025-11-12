// components/system-fees/PackageCard.jsx
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Edit, Save, Trash, X, Star, ArrowUp, Clock } from "lucide-react";

/**
 * Metronic-inspired Tailwind restyle
 * - Clean white card, soft border, subtle shadow
 * - Accent left border + header area
 * - Iconic feature chips
 * - Ghost action buttons (rounded, subtle)
 * - Deleted state with corner ribbon and muted content
 */
export default function PackageCard({ pkg, onDelete }) {
  const perks = [
    pkg.highlight && {
      key: "highlight",
      icon: Star,
      label: "Highlight bài viết",
    },
    pkg.top && { key: "top", icon: ArrowUp, label: "Ưu tiên hiển thị" },
    pkg.duration && {
      key: "duration",
      icon: Clock,
      label: `Thời gian sử dụng: ${pkg.duration} ngày`,
    },
  ].filter(Boolean);

  const isDeleted = Boolean(pkg?.is_deleted);

  return (
    <Card
      className={[
        "relative overflow-hidden",
        "bg-white border border-gray-200/80 shadow-sm",
        "rounded-2xl",
        "transition-all duration-200",
        isDeleted ? "opacity-70 grayscale-[30%]" : "hover:shadow-md",
      ].join(" ")}
    >
      {/* Accent border */}
      <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500/80" />

      {/* Deleted ribbon */}
      {isDeleted && (
        <div className="absolute -right-16 top-4 rotate-45">
          <span className="inline-block bg-rose-600 text-white text-xs tracking-wider px-16 py-1 shadow">
            ĐÃ XÓA
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {pkg.name}
              </h3>
              {!isDeleted && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-medium px-2 py-0.5 border border-indigo-100">
                  GÓI HOẠT ĐỘNG
                </span>
              )}
            </div>

            {/* Description */}
            {pkg.description && (
              <div className="mt-3">
                <p className="text-[13px] font-medium text-gray-700">Mô tả</p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            )}

            {/* Perks */}
            {perks.length > 0 && (
              <div className="mt-4">
                <p className="text-[13px] font-medium text-gray-700">
                  Đặc quyền
                </p>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {perks.map(({ key, icon: Icon, label }) => (
                    <li
                      key={key}
                      className="flex items-center gap-2 rounded-xl border border-gray-200/70 bg-gray-50 px-3 py-2"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                        <Icon size={14} className="text-indigo-700" />
                      </span>
                      <span className="text-sm text-gray-700">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="shrink-0 flex items-center gap-2">
            {!isDeleted && (
              <Button
                type="button"
                onClick={() => onDelete?.(pkg.id)}
                className="h-9 w-9 p-0 inline-flex items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300"
                aria-label="Xóa gói"
                title="Xóa gói"
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Footer note for deleted */}
        {isDeleted && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
            Gói đã bị xóa
          </div>
        )}
      </div>
    </Card>
  );
}
