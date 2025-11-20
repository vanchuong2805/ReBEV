// pages/SystemFeesManagement.jsx
import { useEffect, useState } from "react";
import { DollarSign, Package as PackageIcon, X } from "lucide-react";
import TitlePage from "../components/TitlePage";
import Tabs from "../components/systemfeesComponents/Tabs";


import { Outlet, useNavigate, useLocation } from "react-router";

const tabs = [
  { id: "platform", label: "Phí sàn", icon: DollarSign },
  { id: "packages", label: "Gói người dùng", icon: PackageIcon },
];
export default function SystemFeesManagement() {
  const [activeTab, setActiveTab] = useState("platform");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/fees/package")) {
      setActiveTab("packages");
    } else {
      setActiveTab("platform");
    }
  }, [location.pathname]);

  return (
    <>
      <div className="p-6">
        <TitlePage
          title="Quản lý phí hệ thống"
          description="Cấu hình phí sàn và gói người dùng"
        />

        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(e) => {
            setActiveTab(e);
            if (e === "platform") navigate(`/admin/fees`);
            else navigate(`/admin/fees/package`);
          }}
        />
      </div>
      <Outlet />
    </>
  );
}
