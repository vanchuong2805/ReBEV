import React, { useEffect, useState } from "react"
import { Mail, Phone, Calendar, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/UserContext"
import { getPackages } from "@/features/profile/service"

const ProfileHeader = () => {
  const { user, loading } = useUser()
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackages()
        setPackages(data)
      } catch (error) {
        console.error("Error fetching packages:", error)
      }
    }
    fetchPackages()
  }, [])

  if (loading) {
    return (
      <Card className="mb-8 border-slate-200">
        <CardContent className="p-8 text-slate-500 text-center">
          Đang tải thông tin người dùng...
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="mb-8 border-slate-200">
        <CardContent className="p-8 text-slate-500 text-center">
          Không có thông tin người dùng.
        </CardContent>
      </Card>
    )
  }

  // Lấy gói người dùng
  const userPackage = packages.find((p) => p.id === user.package_id)
  const packageName = userPackage ? userPackage.name : null

  // Tính ngày hết hạn gói
  let packageExpiry = null
  if (userPackage && user.package_start && userPackage.duration) {
    const start = new Date(user.package_start)
    const expiry = new Date(start)
    expiry.setDate(start.getDate() + userPackage.duration)
    packageExpiry = expiry.toLocaleDateString("vi-VN")
  }

  return (
    <Card className="mb-8 border-slate-200 shadow-sm">
      <CardContent className="p-0">

        {/* Header */}
        <div className="relative px-20 pt-8 pb-8">
          <div className="flex flex-col lg:flex-row items-center gap-7">
            
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full blur opacity-25"></div>
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center justify-center lg:justify-start gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  {user.display_name || "Người dùng chưa đặt tên"}
                </h1>

                {/* Badge (có gói mới hiện) */}
                {userPackage && (
                  <Badge className="bg-[#0D1A33] text-white border-0 px-3 py-1 rounded-lg flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    {packageName}
                  </Badge>
                )}
              </div>

              {/* ➤ Thêm dòng HẾT HẠN GÓI tại đây */}
              {userPackage && (
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-700 mt-1">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Hết hạn gói:</span>
                  <span className="font-medium text-slate-900">
                    {packageExpiry}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="px-20 py-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* EMAIL */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-slate-100 rounded-lg">
                <Mail className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-sm text-slate-900 truncate">
                  {user.email || "Chưa có email"}
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-slate-100 rounded-lg">
                <Phone className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Số điện thoại
                </p>
                <p className="text-sm text-slate-900 truncate">
                  {user.phone || "Chưa có số điện thoại"}
                </p>
              </div>
            </div>

            {/* JOIN DATE */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-slate-100 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Ngày tham gia
                </p>
                <p className="text-sm text-slate-900 truncate">
                  {user.create_at
                    ? new Date(user.create_at).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              </div>
            </div>

          </div>
        </div>

      </CardContent>
    </Card>
  )
}

export default ProfileHeader
