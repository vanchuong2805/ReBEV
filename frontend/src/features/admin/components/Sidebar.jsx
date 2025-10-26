import {
  BarChart3,
  DollarSign,
  CreditCard,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    {
      id: "reports",
      label: "Reports & Statistics",
      icon: BarChart3,
    },
    {
      id: "fees",
      label: "System Fees",
      icon: DollarSign,
    },
    {
      id: "transactions",
      label: "Transaction Management",
      icon: CreditCard,
    },
    {
      id: "listings",
      label: "Listing Management",
      icon: FileText,
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
    },
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-600 text-white border-r-4 border-blue-400"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
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
    </div>
  );
};

export default Sidebar;
