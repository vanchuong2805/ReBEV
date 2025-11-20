import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import SidebarNav from "../components/SidebarNav";

const ProfilePage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header và thống kê luôn cố định */}
        <ProfileHeader />

        {/* Layout có sidebar bên trái */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <SidebarNav />
          </div>

          {/* Outlet hiển thị phần nội dung (Listings, Purchases, OrderDetail...) */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
