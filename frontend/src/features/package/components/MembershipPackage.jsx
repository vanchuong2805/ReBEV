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
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  // 🔹 Lấy danh sách gói và sắp xếp theo giá tăng dần
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackage()
        const activePackages = data
          .filter((pkg) => pkg.is_deleted === false)
          .sort((a, b) => a.price - b.price)
        setPackages(activePackages)
        console.log("Gói đã tải:", activePackages)
      } catch (error) {
        console.error("Lỗi tải gói:", error)
      }
    }
    fetchPackages()
  }, [])

  const currentPlan = packages.find((p) => p.id === selectedPlan)

  // 🔹 Xử lý chọn gói
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

    try {
      setLoading(true)
      console.log("Chọn gói:", currentPlan, "cho user:", user.id)

      const data = await createRegisterPackage(user.id, currentPlan.id)
      console.log("Yêu cầu thanh toán đã tạo:", data)

      // ✅ Cập nhật user trong localStorage trước khi chuyển hướng
      const updatedUser = { ...user, package_id: currentPlan.id }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      if (setUser) setUser(updatedUser)

      if (data.payUrl) {
        window.location.href = data.payUrl
      } else {
        alert("Không tìm thấy đường dẫn thanh toán. Vui lòng thử lại.")
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

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const isSelected = selectedPlan === pkg.id
            const style = cardAccents[index % cardAccents.length]

            return (
              <Card
                key={pkg.id}
                className={`relative flex flex-col justify-between min-h-[470px] transition-all duration-300 cursor-pointer
                  ${style.bg} border-2 ${
                    isSelected
                      ? "border-blue-600 shadow-xl shadow-blue-100"
                      : `${style.accent} ${style.hover} hover:shadow-lg`
                  }`}
                onClick={() => setSelectedPlan(pkg.id)}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md cursor-default select-none">
                      Đã chọn
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 px-2">
                    {pkg.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col justify-between h-full">
                  {/* Pricing + Features */}
                  <div>
                    {/* Pricing */}
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

                    {/* Features */}
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

                  {/* Action Button */}
                  <Button
                    onClick={handleChoose}
                    disabled={loading}
                    className={`w-full h-11 font-medium rounded-lg transition-all duration-200 mt-auto
                      ${
                        isSelected
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                          : "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {loading
                      ? "Đang xử lý..."
                      : isSelected
                      ? "Nâng cấp ngay"
                      : "Chọn gói"}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Thanh toán an toàn • Hỗ trợ 24/7 • Hoàn tiền nếu không hài lòng
          </p>
        </div>
      </div>
    </div>
  )
}
