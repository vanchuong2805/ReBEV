import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getOrders } from "../service";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getOrders();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

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
