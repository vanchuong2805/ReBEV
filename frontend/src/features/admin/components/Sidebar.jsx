import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "../service";
import { useNavigate } from "react-router";

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "reports",
      label: "Báo cáo & Thống kê",
      icon: BarChart3,
    },
    {
      id: "fees",
      label: "Quản lý phí hệ thống",
      icon: DollarSign,
    },
    {
      id: "transactions",
      label: "Quản lý giao dịch",
      icon: ShoppingCart,
    },
    {
      id: "listings",
      label: "Quản lý bài đăng",
      icon: FileText,
    },
    {
      id: "users",
      label: "Quản lý người dùng",
      icon: Users,
    },
  ];

  return (
    <div
      className={`bg-slate-800 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-cyan-400">Admin Panel</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-cyan-600 text-white border-r-4 border-cyan-400"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-700 mt-6">
        <button
          onClick={() => {
            logoutAdmin();
            navigate("/");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }}
          className="w-full flex items-center px-4 py-3 text-left transition-colors hover:bg-slate-700 hover:text-white"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
