import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { ROUTES } from "@/constants/routes";
import { useMemo } from "react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const menuItems = useMemo(
    () => [
      {
        id: "reports",
        label: "Báo cáo & Thống kê",
        icon: BarChart3,
        to: ROUTES.ADMIN.DASHBOARD,
      },
      {
        id: "fees",
        label: "Quản lý phí hệ thống",
        icon: DollarSign,
        to: ROUTES.ADMIN.FEES,
      },
      {
        id: "transactions",
        label: "Quản lý giao dịch",
        icon: ShoppingCart,
        to: ROUTES.ADMIN.TRANSACTIONS,
      },
      {
        id: "listings",
        label: "Quản lý bài đăng",
        icon: FileText,
        to: ROUTES.ADMIN.LISTINGS,
      },
      {
        id: "users",
        label: "Quản lý người dùng",
        icon: Users,
        to: ROUTES.ADMIN.USERS,
      },
    ],
    []
  );

  return (
    <aside
      className={[
        "relative z-20 min-h-screen",
        "transition-[width] duration-300 ease-out",
        "bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900/80",
        "backdrop-blur-xl border-r border-white/5",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_10px_30px_-10px_rgba(0,0,0,0.6)]",
        isCollapsed ? "w-[72px]" : "w-[280px]",
      ].join(" ")}
    >
      {/* Toggle floating button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Mở sidebar" : "Thu gọn sidebar"}
        className={[
          "absolute -right-3 top-4 h-8 w-8 rounded-full",
          "grid place-items-center",
          "bg-slate-800/80 hover:bg-slate-700/90",
          "border border-white/10 shadow-lg",
          "backdrop-blur-md transition-colors",
        ].join(" ")}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Brand */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-400/20 grid place-items-center">
            <BarChart3 className="text-cyan-300" size={18} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-cyan-300 font-semibold tracking-wide">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400">Control center</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="group relative">
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.ADMIN.DASHBOARD}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-slate-300 hover:text-white",
                      "transition-colors relative overflow-hidden",
                      "before:absolute before:inset-y-0 before:left-0 before:w-0 before:bg-gradient-to-r before:from-cyan-500/10 before:to-transparent before:transition-all before:duration-300 group-hover:before:w-full",
                      isActive
                        ? "bg-white/[0.04] text-white"
                        : "hover:bg-white/[0.03]",
                    ].join(" ")
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  <span
                    className={[
                      "absolute left-0 top-1/2 -translate-y-1/2 h-5 rounded-r-full",
                      "transition-all duration-300",
                      "bg-gradient-to-b from-cyan-400 via-cyan-300 to-cyan-500",
                      "shadow-[0_0_12px_rgba(34,211,238,0.6)]",
                      "data-[active=false]:w-0 data-[active=true]:w-1.5",
                    ].join(" ")}
                    data-active={
                      // NavLink doesn't expose isActive here, so use CSS via aria-current
                      undefined
                    }
                  />
                  <Icon size={20} className="shrink-0 text-cyan-300/90" />
                  {!isCollapsed && (
                    <span className="font-medium tracking-wide">
                      {item.label}
                    </span>
                  )}

                  {/* Right glow accent */}
                  <span className="ml-auto hidden md:block h-2 w-2 rounded-full bg-cyan-400/60 group-hover:bg-cyan-300/80"></span>
                </NavLink>

                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div
                    className={[
                      "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3",
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                    ].join(" ")}
                  >
                    <div className="whitespace-nowrap rounded-lg bg-slate-800 text-white text-xs px-2 py-1 border border-white/10 shadow-xl">
                      {item.label}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Logout */}
      <div className="px-2 mt-auto">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "text-slate-300 hover:text-white hover:bg-white/[0.04]",
            "transition-colors",
          ].join(" ")}
        >
          <LogOut size={20} className="shrink-0 text-rose-300/90" />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
