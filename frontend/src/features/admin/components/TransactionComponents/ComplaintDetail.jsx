import React from "react";
import { X, Image as ImageIcon, User, AlertTriangle } from "lucide-react";

// Popup hiển thị chi tiết khiếu nại (complaint)
// Props:
//  - openDetail: boolean mở/đóng
//  - complaint: object dữ liệu khiếu nại
//  - onClose: hàm đóng
//  - onChangeStatus?: (newStatus) => void (tuỳ chọn)
export default function ComplaintDetail({
  openDetail,
  complaint,
  onClose,
  onChangeStatus,
}) {
  if (!openDetail || !complaint) return null;

  const parseMedia = (mediaStr) => {
    if (!mediaStr) return [];
    try {
      const arr = JSON.parse(mediaStr);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("vi-VN", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  // Mapping trạng thái & loại (có thể cần chỉnh lại theo backend thực tế)
  const STATUS_MAP = {
    0: { label: "Chờ xử lý", color: "bg-amber-500" },
    1: { label: "Đang xử lý", color: "bg-green-600" },
    2: { label: "Hoàn tất", color: "bg-red-600" },
    3: { label: "Từ chối", color: "bg-gray-600" },
  };
  const TYPE_MAP = {
    0: "Chờ xử lí",
    1: "Chấp nhận",
    2: "Từ chối",
    3: "Hủy",
  };

  const statusInfo = STATUS_MAP[complaint.complaint_status] || {
    label: "Không rõ",
    color: "bg-gray-400",
  };

  // Lưu ý: field gốc bạn đưa là 'conplaint_type' bị sai chính tả; dùng cả hai để phòng.

  const mediaItems = parseMedia(complaint.media);
  const post = complaint.order_detail?.post;
  const user = complaint.user;
  const moderator = complaint.moderator_user;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-white">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"></h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-8 overflow-y-auto">
          {/* Row 1: trạng thái & loại */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500">Trạng thái</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${statusInfo.color}`}
              >
                {TYPE_MAP[complaint.complaint_status]}
              </span>
            </div>

            <div className="space-y-2"></div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500">Thời gian</p>
              <p className="text-xs text-slate-700">
                Tạo: {formatDate(complaint.create_at)}
              </p>
              <p className="text-xs text-slate-700">
                Cập nhật: {formatDate(complaint.update_at)}
              </p>
            </div>
          </div>

          {/* Người dùng & Moderator */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3 items-start">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Người khiếu nại
                </p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.display_name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  SĐT: {user?.phone || "-"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Email: {user?.email || "-"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {moderator?.avatar ? (
                  <img
                    src={moderator.avatar}
                    alt={moderator.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Điều phối viên
                </p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {moderator?.display_name || "(Chưa gán)"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  SĐT: {moderator?.phone || "-"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Email: {moderator?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          {complaint.description && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500">Mô tả</p>
              <div className="text-sm leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100">
                {complaint.description}
              </div>
            </div>
          )}

          {/* Media */}
          {mediaItems.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <ImageIcon size={14} /> Hình ảnh đính kèm ({mediaItems.length})
              </p>
              <div className="flex flex-wrap gap-4">
                {mediaItems.map((m, idx) => (
                  <a
                    key={idx}
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group w-32 h-32 rounded-md overflow-hidden border border-slate-200 bg-slate-100 relative"
                  >
                    <img
                      src={m.url}
                      alt={"media-" + idx}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bài đăng liên quan (post) */}
          {post && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500">
                Bài đăng liên quan
              </p>
              <div className="flex gap-4 p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="w-24 h-24 rounded-md bg-slate-100 overflow-hidden border border-slate-200">
                  {parseMedia(post.media)[0]?.url ? (
                    <img
                      src={
                        parseMedia(post.media)[0]
                          .url.split(" ")
                          .slice(1)
                          .join(" ") || parseMedia(post.media)[0].url
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 grid place-items-center h-full">
                      No Image
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Giá:{" "}
                    <span className="font-semibold text-indigo-600">
                      {post.price?.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Post ID: {post.id}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 px-6 py-4 border-t bg-slate-50">
          <div className="flex gap-2">
            {onChangeStatus && complaint.complaint_status !== 2 && (
              <button
                onClick={() => onChangeStatus(2)}
                className="px-3 py-2 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Đánh dấu hoàn tất
              </button>
            )}
            {onChangeStatus && complaint.complaint_status !== 3 && (
              <button
                onClick={() => onChangeStatus(3)}
                className="px-3 py-2 text-xs font-medium rounded-md bg-rose-600 text-white hover:bg-rose-500"
              >
                Từ chối
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
