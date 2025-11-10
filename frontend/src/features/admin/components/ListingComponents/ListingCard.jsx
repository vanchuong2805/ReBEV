import React, { useMemo } from "react";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export default function ListingCard({
  listing,
  onViewDetails,
  onApprove,
  onReject,
}) {
  const media = useMemo(() => {
    try {
      return JSON.parse(listing.media || "[]");
    } catch {
      return [];
    }
  }, [listing.media]);

  const thumbnail = media.find((m) => m.is_thumbnail)?.url || media[0]?.url || "";
  const imageUrl = thumbnail?.split(" ")[1] || null;

  const getStatusMeta = (status) => {
    switch (status) {
      case 1:
        return {
          text: "Đã Duyệt",
          color: "bg-emerald-100 text-emerald-700",
          icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
        };
      case 0:
        return {
          text: "Chờ Duyệt",
          color: "bg-amber-100 text-amber-700",
          icon: <Clock className="h-4 w-4 text-amber-500" />,
        };
      case 2:
        return {
          text: "Từ Chối",
          color: "bg-rose-100 text-rose-700",
          icon: <XCircle className="h-4 w-4 text-rose-500" />,
        };
      case 3:
        return {
          text: "Hoàn tất giao dịch",
          color: "bg-blue-100 text-blue-700",
          icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
        };
      default:
        return {
          text: "Không xác định",
          color: "bg-gray-100 text-gray-700",
          icon: <Clock className="h-4 w-4 text-gray-500" />,
        };
    }
  };

  const statusMeta = getStatusMeta(listing.status);

  return (
    <Card
      className={[
        "p-5 md:p-6 rounded-2xl border border-slate-200/70",
        "bg-white/90 backdrop-blur-md shadow-sm hover:shadow-lg transition-shadow",
      ].join(" ")}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Image */}
        <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-slate-100 shadow-inner">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-slate-400 text-sm">
              Không có ảnh
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Title + Status */}
          <div className="flex justify-between items-start mb-3 gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {listing.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <span>
                  Loại: {listing.category_id == 1 ? "Xe Máy Điện" : "Pin"}
                </span>
              </div>
            </div>

            <Badge className={`${statusMeta.color} border-0`}>
              <div className="flex items-center gap-1">
                {statusMeta.icon}
                <span className="text-sm">{statusMeta.text}</span>
              </div>
            </Badge>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Người bán</p>
              <p className="font-medium text-slate-800">
                {listing?.user?.display_name || "Không rõ"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Giá</p>
              <p className="text-lg font-bold text-blue-600">
                {listing.price.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Tạo ngày: {new Date(listing.create_at).toLocaleString("vi-VN")}
          </p>

        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full lg:w-36 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-slate-300 hover:bg-slate-50"
            onClick={() => onViewDetails(listing.id)}
          >
            <Eye size={16} className="mr-1" />
            Xem
          </Button>

          {/* Từ chối */}
          {listing.status === 0 || listing.status === 1 ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-rose-300 text-rose-600 hover:bg-rose-50"
              onClick={() => onReject(listing.id)}
            >
              Từ chối
            </Button>
          ) : null}

          {/* Duyệt */}
          {listing.status === 0 || listing.status === 2 ? (
            <Button
              size="sm"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-[0_6px_18px_-6px_rgba(16,185,129,0.6)] text-white"
              onClick={() => onApprove(listing.id)}
            >
              Phê duyệt
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
