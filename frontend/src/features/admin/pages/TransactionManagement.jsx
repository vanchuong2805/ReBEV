import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import TitlePage from "../components/TitlePage";
import { Outlet, useLocation, useNavigate } from "react-router";
import Tabs from "../components/systemfeesComponents/Tabs";

const TransactionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchase-orders");
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/transactions/purchase-orders")) {
      setActiveTab("purchase-orders");
    } else if (location.pathname.includes("/transactions/deposit-orders")) {
      setActiveTab("deposit-orders");
    } else if (location.pathname.includes("/transactions/complaint-orders")) {
      setActiveTab("complaint-orders");
    } else if (location.pathname.includes("/transactions/return-orders")) {
      setActiveTab("return-orders");
    }
  }, [location.pathname]);

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
      <Tabs
        tabs={tabs}
        activeId={activeTab}
        onChange={(e) => {
          setActiveTab(e);
          if (e === "purchase-orders")
            navigate(`/admin/transactions/purchase-orders`);
          else if (e === "deposit-orders")
            navigate(`/admin/transactions/deposit-orders`);
          else if (e === "complaint-orders")
            navigate(`/admin/transactions/complaint-orders`);
          else if (e === "return-orders")
            navigate(`/admin/transactions/return-orders`);
        }}
      />

      <Outlet />
    </div>
  );
};

export default TransactionManagement;
