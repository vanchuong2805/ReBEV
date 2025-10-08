import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ReportsStatistics from "./ReportsStatistics";
import OrderManagement from "./OrderManagement";
import ComplaintManagement from "./ComplaintManagement";
import SystemFeesManagement from "./SystemFeesManagement";
import TransactionManagement from "./TransactionManagement";
import ListingManagement from "./ListingManagement";
import UserManagement from "./UserManagement";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "reports":
        return <ReportsStatistics />;
      case "orders":
        return <OrderManagement />;
      case "complaints":
        return <ComplaintManagement />;
      case "fees":
        return <SystemFeesManagement />;
      case "transactions":
        return <TransactionManagement />;
      case "listings":
        return <ListingManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <ReportsStatistics />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="h-full">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminPage;
