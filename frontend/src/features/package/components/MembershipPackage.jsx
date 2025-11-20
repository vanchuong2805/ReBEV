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
import { toast } from "sonner"

const cardAccents = [
  { bg: "bg-white", accent: "border-gray-200", hover: "hover:border-gray-300" },
  { bg: "bg-gradient-to-br from-slate-50 to-white", accent: "border-slate-200", hover: "hover:border-slate-300" },
  { bg: "bg-gradient-to-br from-blue-50/40 to-white", accent: "border-blue-100", hover: "hover:border-blue-200" }
]

export default function MembershipPackage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPackages, setLoadingPackages] = useState(true)

  const [currentUserPackage, setCurrentUserPackage] = useState(null)
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPackage()

        const filtered = data
          .filter(pkg => !pkg.is_deleted || pkg.id === user?.package_id)
          .sort((a, b) => a.price - b.price)

        setPackages(filtered)
        const current =
          data.find(p => p.id === user?.package_id) || { id: null, price: 0 }

        setCurrentUserPackage(current)
      } catch (err) {
        console.error("Error loading packages:", err)
      } finally {
        setLoadingPackages(false)
      }
    }

    fetchData()
  }, [user])

  const handleChoose = async (packageId) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập trước!")
      navigate("/login")
      return
    }

    const selectedPkg = packages.find(p => p.id === packageId)

    if (!selectedPkg) {
      toast.error("Không tìm thấy gói!")
      return
    }

    if (selectedPkg.id === user.package_id) {
      toast.info("Bạn đang sử dụng gói này.")
      return
    }

    if (currentUserPackage && selectedPkg.price <= currentUserPackage.price) {
      toast.error("Bạn chỉ có thể nâng cấp lên gói cao hơn.")
      return
    }

    try {
      setLoading(true)
      const data = await createRegisterPackage(user.id, selectedPkg.id)

      if (data.payUrl) {
        window.location.href = data.payUrl
      } else {
        toast.error("Không tìm thấy đường dẫn thanh toán.")
      }
    } catch (err) {
      console.error("Upgrade error:", err)
      toast.error("Không thể tạo giao dịch nâng cấp.")
    } finally {
      setLoading(false)
    }
  }

  if (loadingPackages) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải gói thành viên...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Chọn gói thành viên
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nâng cấp để tin đăng nổi bật hơn & tiếp cận nhiều khách hàng hơn.
          </p>
        </div>

        {/* GÓI THÀNH VIÊN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const isSelected = selectedPlan === pkg.id
            const isCurrent = pkg.id === user?.package_id
            const isLowerPlan = pkg.price <= currentUserPackage.price
            const disabled = isCurrent || isLowerPlan

            const style = cardAccents[index % cardAccents.length]

            return (
              <Card
                key={pkg.id}
                onClick={() => !disabled && setSelectedPlan(pkg.id)}
                className={`relative flex flex-col justify-between min-h-[470px]
                  transition-all duration-300
                  ${style.bg} border-2
                  ${isSelected ? "border-blue-600 shadow-xl shadow-blue-100"
                                : `${style.accent} ${style.hover} hover:shadow-lg`}
                  ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >

                {/* Badge */}
                {(isSelected || isCurrent) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-xs font-semibold px-4 py-1.5 rounded-full shadow-md
                        ${isCurrent ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}
                    >
                      {isCurrent ? "Gói hiện tại" : "Đã chọn"}
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 px-2 line-clamp-2">
                    {pkg.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col justify-between h-full">

                  {/* Giá */}
                  <div className="text-center mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {pkg.price === 0 ? "Miễn phí" : pkg.price.toLocaleString("vi-VN")}
                      </span>
                      {pkg.price > 0 && <span className="text-lg text-gray-500">đ</span>}
                    </div>

                    {pkg.duration > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {pkg.duration} ngày
                      </p>
                    )}
                  </div>

                  {/* Tính năng */}
                  <div className="space-y-3 mb-6 min-h-[70px]">
                    {pkg.highlight && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>Tin đăng nổi bật</span>
                      </div>
                    )}

                    {pkg.top && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-3 h-3 text-amber-600" />
                        </div>
                        <span>Hiển thị trang chủ</span>
                      </div>
                    )}

                    {!pkg.highlight && !pkg.top && (
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-gray-400" />
                        </div>
                        <span>Đăng tin thường</span>
                      </div>
                    )}
                  </div>

                  {/* BUTTON → Thanh toán ngay */}
                  <Button
                    onClick={() => !disabled && handleChoose(pkg.id)}
                    disabled={loading || disabled}
                    className={`w-full h-11 font-medium rounded-lg mt-auto transition-all
                      ${isCurrent
                        ? "bg-green-600 text-white cursor-default"
                        : disabled
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`}
                  >
                    {isCurrent
                      ? "Đang sử dụng"
                      : loading
                        ? "Đang xử lý..."
                        : "Chọn gói"}

                    {!loading && !isCurrent && !disabled && (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>

                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Thanh toán an toàn • Hỗ trợ 24/7 • Hoàn tiền nếu không hài lòng
          </p>
        </div>

      </div>
    </div>
  )
}
