import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getOrdersById } from "../../service";
import OrderTimeline from "@/features/profile/components/order/OrderTimeline";
import OrderAddress from "@/features/profile/components/order/OrderAddress";
import OrderSummary from "@/features/profile/components/order/OrderSummary";

export default function OrderTableDetail({ openDetail, orderId, onClose }) {
  const [order, setOrder] = useState(null);

  console.log("orderId", orderId);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrdersById(orderId);
      console.log("data", data);
      setOrder(data);
    };
    fetchData();
  }, [orderId]);
  if (!openDetail || !orderId) return null;

  const STATUS_STYLES = {
    DELIVERING: "bg-amber-500 text-white",
    PAID: "bg-emerald-600 text-white",
    CONFIRMED: "bg-indigo-600 text-white",
    DELIVERED: "bg-cyan-600 text-white",
    CANCELLED: "bg-rose-600 text-white",
    FAIL_PAY: "bg-rose-600 text-white",
    PENDING: "bg-yellow-500 text-white",
    COMPLETED: "bg-blue-600 text-white",
  };

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("vi-VN", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const getPostThumb = (mediaStr) => {
    if (!mediaStr) return null;
    try {
      const arr = JSON.parse(mediaStr);
      if (!Array.isArray(arr)) return null;
      const thumbObj = arr.find((m) => m.is_thumbnail) || arr[0];
      if (!thumbObj) return null;
      const parts = (thumbObj.url || "").split(" ");
      return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
    } catch {
      return null;
    }
  };

  const posts = order?.order_details || [];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-indigo-50 to-white">
          <h3 className="text-lg font-semibold text-slate-800">
            Chi tiết đơn mua
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-8 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <OrderAddress
                toContact={JSON.parse(order?.to_contact || "{}")}
                fromContact={JSON.parse(order?.from_contact || "{}")}
                type={order?.order_type}
              />
            </div>
            <div className="space-y-3">
              <OrderTimeline
                timeline={order?.order_statuses.sort((a, b) => b.id - a.id)}
              />
            </div>
          </div>

          {/* Danh sách sản phẩm trong đơn */}
          {posts.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700">
                Sản phẩm trong đơn ({posts.length})
              </h4>
              <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                {posts.map((od, idx) => {
                  const p = od.post || {};
                  const thumb = getPostThumb(p.media);
                  return (
                    <div
                      key={od.id || idx}
                      className={`flex items-center gap-4 px-5 py-4 text-sm ${
                        idx !== posts.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            No Img
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {p.title || "(Không có tiêu đề)"}
                        </p>
                        {p.category?.name && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Phân loại: {p.category.name}
                          </p>
                        )}
                        {od.appointment_time && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            Hẹn: {formatDate(od.appointment_time)}
                          </p>
                        )}
                      </div>
                      <div className="text-right font-semibold text-indigo-600 whitespace-nowrap">
                        {p.price?.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lịch sử trạng thái */}

          {order && <OrderSummary order={order} />}
        </div>
      </div>
    </div>
  );
}
