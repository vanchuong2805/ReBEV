import React, { useState, useEffect } from "react"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPackage, createRegisterPackage } from "../service"
import { useUser } from "@/contexts/UserContext"
import { useNavigate } from "react-router-dom"

const cardAccents = [
  { bg: "bg-white", accent: "border-gray-200", hover: "hover:border-gray-300" },
  { bg: "bg-gradient-to-br from-slate-50 to-white", accent: "border-slate-200", hover: "hover:border-slate-300" },
  { bg: "bg-gradient-to-br from-blue-50/40 to-white", accent: "border-blue-100", hover: "hover:border-blue-200" }
]

export default function MembershipPackage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentUserPackage, setCurrentUserPackage] = useState(null)
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackage()

        const filteredPackages = data
          .filter(pkg => !pkg.is_deleted || pkg.id === user?.package_id)
          .sort((a, b) => a.price - b.price)

        setPackages(filteredPackages)

        const current = data.find(p => p.id === user?.package_id)
        setCurrentUserPackage(current)
      } catch (error) {
        console.error("Lỗi tải gói:", error)
      }
    }
    fetchPackages()
  }, [user])

  const currentPlan = packages.find((p) => p.id === selectedPlan)

  const handleChoose = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập trước khi nâng cấp gói!")
      navigate("/login")
      return
    }

    if (!currentPlan) {
      alert("Vui lòng chọn gói thành viên!")
      return
    }

    if (currentUserPackage && currentPlan.price <= currentUserPackage.price) {
      alert("Bạn chỉ có thể nâng cấp lên gói cao hơn gói hiện tại!")
      return
    }

    try {
      setLoading(true)
      const data = await createRegisterPackage(user.id, currentPlan.id)

      const updatedUser = { ...user, package_id: currentPlan.id }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      if (setUser) setUser(updatedUser)

      if (data.payUrl) {
        window.location.href = data.payUrl
      } else {
        alert("Không tìm thấy đường dẫn thanh toán.")
      }
    } catch (error) {
      console.error("Lỗi khi chọn gói:", error)
      alert("Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Chọn gói thành viên
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nâng cấp tài khoản để tin đăng nổi bật hơn và tiếp cận nhiều khách hàng hơn
          </p>
        </div>

        {/* Danh sách gói */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const isSelected = selectedPlan === pkg.id
            const isCurrent = pkg.id === user?.package_id
            const isLowerPlan =
              currentUserPackage && pkg.price <= currentUserPackage.price

            const style = cardAccents[index % cardAccents.length]

            return (
              <Card
                key={pkg.id}
                onClick={() => {
                  if (isLowerPlan) return
                  setSelectedPlan(pkg.id)
                }}
                className={`relative flex flex-col justify-between min-h-[470px] transition-all duration-300 cursor-pointer
                  ${style.bg} border-2 ${
                    isSelected
                      ? "border-blue-600 shadow-xl shadow-blue-100"
                      : `${style.accent} ${style.hover} hover:shadow-lg`
                  } ${isLowerPlan ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {/* Badge hiển thị */}
                {(isSelected || isCurrent) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-xs font-semibold px-4 py-1.5 rounded-full shadow-md ${
                        isCurrent
                          ? pkg.is_deleted
                            ? "bg-gray-500 text-white"
                            : "bg-green-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {isCurrent
                        ? pkg.is_deleted
                          ? "Gói hiện tại (đã ngừng)"
                          : "Gói hiện tại"
                        : "Đã chọn"}
                    </span>
                  </div>
                )}

                {/* Header */}
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 px-2">
                    {pkg.description}
                  </p>
                </CardHeader>

                {/* Nội dung */}
                <CardContent className="pt-0 flex flex-col justify-between h-full">
                  {/* Giá */}
                  <div>
                    <div className="text-center mb-6 pb-6 border-b border-gray-100">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          {pkg.price === 0
                            ? "Miễn phí"
                            : pkg.price.toLocaleString("vi-VN")}
                        </span>
                        {pkg.price > 0 && (
                          <span className="text-lg text-gray-500">đ</span>
                        )}
                      </div>
                      {pkg.duration && pkg.duration !== 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {pkg.duration} ngày
                        </p>
                      )}
                    </div>

                    {/* Tính năng */}
                    <div className="space-y-3 mb-6 min-h-[70px]">
                      {pkg.highlight && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-blue-600" />
                          </div>
                          <span>Tin đăng nổi bật</span>
                        </div>
                      )}
                      {pkg.top && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                            <TrendingUp className="w-3 h-3 text-amber-600" />
                          </div>
                          <span>Hiển thị trang chủ</span>
                        </div>
                      )}
                      {!pkg.highlight && !pkg.top && (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-gray-400" />
                          </div>
                          <span>Đăng tin thường</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <Button
                    onClick={handleChoose}
                    disabled={loading || isLowerPlan || isCurrent}
                    className={`w-full h-11 font-medium rounded-lg transition-all duration-200 mt-auto
                      ${
                        isCurrent
                          ? "bg-green-600 text-white cursor-default"
                          : isSelected
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                          : "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {isCurrent
                      ? "Đang sử dụng"
                      : loading
                      ? "Đang xử lý..."
                      : isSelected
                      ? "Nâng cấp ngay"
                      : "Chọn gói"}
                    {!loading && !isCurrent && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer nhỏ */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Thanh toán an toàn • Hỗ trợ 24/7 • Hoàn tiền nếu không hài lòng
          </p>
        </div>
      </div>
    </div>
  )
}
