import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const AdminPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useUser();
  console.log(user);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          <Outlet /> {/* Nơi route con được render */}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
