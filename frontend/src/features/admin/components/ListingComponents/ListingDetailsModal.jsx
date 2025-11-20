import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

export default function ListingDetailsModal({ open, listing, onClose, onApprove, onReject }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const media = useMemo(() => {
    try {
      return JSON.parse(listing?.media || "[]");
    } catch {
      return [];
    }
  }, [listing?.media]);

  const imageUrls = media.map(m => {
    // media url format in your data had extra word "image <url>"
    const parts = (m?.url || "").split(" ");
    return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 max-w-4xl w-full mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{listing?.title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Large image area */}
          <div className="lg:col-span-2">
            <div className="w-full h-[360px] bg-slate-100 flex items-center justify-center overflow-hidden rounded">
              {imageUrls.length > 0 ? (
                <img
                  src={imageUrls[activeIndex]}
                  alt={`image-${activeIndex}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-400">Không có ảnh</div>
              )}
            </div>

            {/* thumbnails */}
            {imageUrls.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {imageUrls.map((u, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-20 h-20 rounded overflow-hidden border ${idx === activeIndex ? "ring-2 ring-emerald-400" : "border-slate-200"}`}
                  >
                    <img src={u} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-1">
            <div className="mb-3">
              <p className="text-sm text-slate-500">Người bán</p>
              <p className="font-medium">{listing?.user?.display_name || "Không rõ"}</p>
            </div>

            <div className="mb-3">
              <p className="text-sm text-slate-500">Giá</p>
              <p className="text-lg font-bold text-blue-600">
                {listing?.price?.toLocaleString?.("vi-VN") ?? listing?.price} VND
              </p>
            </div>

            <div className="mb-3 text-sm text-slate-500">
              <p>Tạo ngày:</p>
              <p className="text-slate-700">{listing?.create_at ? new Date(listing.create_at).toLocaleString("vi-VN") : "-"}</p>
            </div>

            <div className="mb-3 text-sm text-slate-500">
              <p>Liên hệ:</p>
              <p className="text-slate-700">{listing?.user?.phone || "-"}</p>
              <p className="text-slate-700">{listing?.user?.email || "-"}</p>
            </div>

            {/* actions */}
            <div className="mt-4 flex flex-col gap-2">
              {(listing?.status === 0 || listing?.status === 2) && (
                <button
                  onClick={() => onApprove && onApprove(listing.id)}
                  className="w-full rounded-xl bg-emerald-600 text-white py-2 hover:bg-emerald-700"
                >
                  Phê duyệt
                </button>
              )}

              {(listing?.status === 0 || listing?.status === 1) && (
                <button
                  onClick={() => onReject && onReject(listing.id)}
                  className="w-full rounded-xl border border-rose-300 text-rose-600 py-2 hover:bg-rose-50"
                >
                  Từ chối
                </button>
              )}

              <a
                href={imageUrls[activeIndex] || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-center text-sm underline text-slate-600"
              >
                Mở ảnh trong tab mới
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
