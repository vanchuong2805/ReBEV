import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import TitlePage from "../components/TitlePage";
import FilterTransaction from "../components/TransactionComponents/FilterTransaction";
import OrderTable from "../components/TransactionComponents/OrderTable";
import DepositOrdersTable from "../components/TransactionComponents/DepositOrdersTable";
import DepositDetailModal from "../components/TransactionComponents/DepositDetailModal";
import ComplaintsTable from "../components/TransactionComponents/ComplaintsTable";
import ComplaintDetailModal from "../components/TransactionComponents/ComplaintDetailModal";
import SearchInput from "../components/SearchInput";
import SortSelector from "../components/SortSelector";
import { getOrders } from "../service";
import { Outlet, useNavigate } from "react-router";

const TransactionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchase-orders");
  const [oderss, setOrderss] = useState([]);
  useEffect(() => {
    getOrders().then((data) => {
      setOrderss(data);
    });
  }, []);
  console.log(oderss);

  const tabs = [
    { id: "purchase-orders", label: "Đơn Mua", icon: CheckCircle },
    { id: "deposit-orders", label: "Đơn đặt cọc", icon: Clock },
    { id: "complaint-orders", label: "Đơn khiếu nại", icon: AlertTriangle },
    { id: "return-orders", label: "Trả hàng", icon: RotateCcw },
  ];

  // Sort orders by selected sort option

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý giao dịch"
        description="Quản lý đơn hàng, đặt cọc và khiếu nại"
      />

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    console.log(activeTab.id);
                    navigate(`/admin/transactions/${tab.id}`);
                  }}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      <Outlet />
      {/* Tab Content */}
    </div>
  );
};

export default TransactionManagement;
