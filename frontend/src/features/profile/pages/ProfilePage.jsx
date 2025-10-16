import React from "react"
import { Outlet } from "react-router-dom"
import ProfileHeader from "../components/ProfileHeader"
import StatsGrid from "../components/StatsGrid"
import SidebarNav from "../components/SidebarNav"

const ProfilePage = () => {
  const userData = {
    name: "Nguyễn Văn Nam",
    email: "nam.nguyen@email.com",
    phone: "+84 901 234 567",
    location: "TP.HCM, Việt Nam",
    memberSince: "Tháng 3, 2023",
    avatar: "https://picsum.photos/120",
    rating: 4.8,
    totalReviews: 47,
    verificationStatus: "Đã xác thực",
    memberLevel: "Gold",
  }

  const stats = {
    totalListings: 8,
    soldItems: 15,
    purchases: 3,
    earnings: "₫245,000,000",
    saved: 12,
    views: 1247,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header và thống kê luôn cố định */}
        <ProfileHeader userData={userData} />
        <StatsGrid stats={stats} />

        {/* Layout có sidebar bên trái */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
  )
}

export default ProfilePage
