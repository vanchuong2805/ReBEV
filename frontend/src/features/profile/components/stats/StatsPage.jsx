import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { getUserStatistics } from "@/features/profile/service"
import BarChartComponent from "@/features/admin/components/ReportComponents/BarChartComponent"
import { Loader2 } from "lucide-react"
import StatCard from "./StatCard"

export default function StatsPage() {
  const { user } = useUser()
  const [stats, setStats] = useState(null)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const data = await getUserStatistics(user.id, year)
      setStats(data)
    } catch (error) {
      console.error("Lỗi tải thống kê:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user, year])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Đang tải thống kê...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Thống kê bán hàng</h1>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng tin đăng" value={stats.totalPosts} type="posts" />
        <StatCard title="Đang bán" value={stats.sellingPosts} type="selling" />
        <StatCard title="Đã bán" value={stats.soldPosts} type="sold" />
        <StatCard title="Đang giao dịch" value={stats.tradingPosts} type="trading" />
      </div>

      {/* ===== TOTAL REVENUE ===== */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Tổng doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalRevenue.toLocaleString("vi-VN")} VND
          </p>
        </CardContent>
      </Card>

      {/* ===== CHART + YEAR SELECT ===== */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Doanh thu theo tháng
        </h2>

        {/* Dropdown chọn năm chỉ cho Chart */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg bg-white shadow-sm text-slate-700"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i
            return <option key={y} value={y}>{y}</option>
          })}
        </select>
      </div>

      {/* ===== CHART ===== */}
      <Card className="shadow-sm p-4 h-[420px]">
        <BarChartComponent
          data={stats.monthlyRevenue}
          title=""
          color="rgba(37, 99, 235, 0.8)"
          year={year}
          monthly={true}
        />
      </Card>
    </div>
  )
}
