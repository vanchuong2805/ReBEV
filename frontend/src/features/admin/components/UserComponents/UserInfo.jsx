import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Lock, Mail, Phone, Unlock, User } from "lucide-react";
import { fetchPost, getFullPackage } from "../../service";

export default function UserInfo({
  user,
  handleLockUser,
  handleUnlockUser,
  getRoleText,
  getRoleColor,
  getStatusColor,
}) {
  const [packageList, setPackageList] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch song song để mượt hơn
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [pkgs, posts] = await Promise.all([getFullPackage(), fetchPost()]);
        if (!alive) return;
        setPackageList(pkgs || []);
        setListings(posts || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const userPackageName = useMemo(() => {
    if (!user?.package_id) return null;
    return packageList.find((p) => p.id === user.package_id)?.name || "Gói chưa xác định";
  }, [packageList, user?.package_id]);

  const userPostsCount = useMemo(() => {
    if (!Array.isArray(listings)) return 0;
    return listings.filter((l) => l.user_id === user.id).length;
  }, [listings, user?.id]);

  // badge gói: màu tím nhạt kiểu Metronic
  const pkgBadgeClass =
    "bg-violet-100 text-violet-700 border-0 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.08)]";

  return (
    <Card
      key={user.id}
      className={[
        "p-5 md:p-6 rounded-2xl border border-slate-200/70",
        "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "shadow-sm hover:shadow-lg transition-shadow",
      ].join(" ")}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={[
              "relative shrink-0",
              "h-14 w-14 rounded-full overflow-hidden",
              "ring-2 ring-cyan-200/60 shadow-[0_6px_20px_-8px_rgba(34,211,238,0.6)]",
            ].join(" ")}
          >
            <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 grid place-items-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.display_name || user.name || "avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-slate-500" />
              )}
            </div>
            {/* dot trạng thái */}
            <span
              className={[
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                user?.is_locked ? "bg-rose-400" : "bg-emerald-400",
              ].join(" ")}
            />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base md:text-lg font-semibold text-slate-900 truncate">
                {user.display_name || user.name || "N/A"}
              </h3>

              <Badge className={`${getStatusColor(user.is_locked)} border-0`}>
                {user.is_locked ? "Bị khóa" : "Hoạt động"}
              </Badge>

              <Badge className={`${getRoleColor(user.role)} border-0`}>
                {getRoleText(user.role)}
              </Badge>

              {!!userPackageName && (
                <Badge className={pkgBadgeClass}>{userPackageName}</Badge>
              )}
            </div>

            {/* meta grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-500 font-medium">ID:</span>
                <span className="text-slate-800 truncate">{user.id}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700 truncate">
                  {user.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700 truncate">
                  {user.phone || "N/A"}
                </span>
              </div>
            </div>

            {/* metrics cho user thường */}
            {Number(user.role) === 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <span className="text-slate-500">Tin đăng</span>
                  <div className="font-semibold text-blue-600">{userPostsCount}</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <span className="text-slate-500">Giao dịch</span>
                  <div className="font-semibold text-emerald-600">
                    {user.totalTransactions || 0}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <span className="text-slate-500">Ngày tạo</span>
                  <div className="font-medium text-slate-700">
                    {user.create_at
                      ? new Date(user.create_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}

            {/* nếu không phải user thường, vẫn show ngày tạo gọn */}
            {Number(user.role) !== 0 && (
              <div className="mt-3 text-sm text-slate-600">
                <span className="text-slate-500">Ngày tạo:</span>
                <span className="ml-1">
                  {user.create_at
                    ? new Date(user.create_at).toLocaleDateString("vi-VN")
                    : "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col items-stretch gap-2">
          {user.role !== 2 &&
            (user.is_locked === false ? (
              <Button
                size="sm"
                variant="outline"
                className={[
                  "border-rose-200 text-rose-600 hover:bg-rose-50",
                  "rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                ].join(" ")}
                onClick={() => handleLockUser(user.id)}
                disabled={loading}
              >
                <Lock size={16} className="mr-1" />
                Khóa tài khoản
              </Button>
            ) : (
              <Button
                size="sm"
                className={[
                  "bg-emerald-600 hover:bg-emerald-700 text-white",
                  "rounded-xl shadow-[0_8px_18px_-10px_rgba(16,185,129,0.7)]",
                ].join(" ")}
                onClick={() => handleUnlockUser(user.id)}
                disabled={loading}
              >
                <Unlock size={16} className="mr-1" />
                Mở khóa tài khoản
              </Button>
            ))}
        </div>
      </div>

      {/* Loading shimmer (chỉ khi đang tải package/posts lần đầu) */}
      {loading && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/3 animate-[loading_1.2s_ease_infinite] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
        </div>
      )}

      {/* keyframes cho shimmer */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </Card>
  );
}
