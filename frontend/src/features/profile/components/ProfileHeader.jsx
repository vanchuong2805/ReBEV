import React from "react"
import { useUser } from "@/contexts/UserContext"
import { Shield, Mail, Phone, Calendar, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ProfileHeader = () => {
  const { user, loading } = useUser()

  // 🔹 Hiển thị khi đang tải
  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-gray-500 text-center">
          Đang tải thông tin người dùng...
        </CardContent>
      </Card>
    )
  }

  // 🔹 Hiển thị khi chưa có user (chưa đăng nhập)
  if (!user) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-gray-500 text-center">
          Không có thông tin người dùng.
        </CardContent>
      </Card>
    )
  }

  // 🔹 Giao diện chính
  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Ảnh đại diện */}
          <div className="relative">
            <img
              src={user.avatar || "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Thông tin người dùng */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.display_name || "Người dùng chưa đặt tên"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {user.package_id ? `VIP${user.package_id}` : "Basic"} Member
                  </Badge>
                </div>
              </div>
            </div>

            {/* Email / SĐT / Ngày tham gia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email || "Chưa có email"}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {user.phone || "Chưa có số điện thoại"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Thành viên từ{" "}
                {user.create_at
                  ? new Date(user.create_at).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileHeader
