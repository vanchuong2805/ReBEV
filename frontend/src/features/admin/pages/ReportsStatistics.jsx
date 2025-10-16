import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { statsData } from "../../../data/data";
import StatsCards from "../components/StatsCards";
import TitlePage from "../components/TitlePage";
import BarChartComponent from "../components/BarChartComponent";
import YearSelector from "../components/YearSelector";
import reportService from "../services/reportService";

const ReportsStatistics = () => {
  const [stats] = useState(statsData);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [monthlyData, setMonthlyData] = useState([]);

  // Cập nhật dữ liệu khi năm thay đổi
  useEffect(() => {
    const yearData = reportService.getDataByYear(selectedYear);
    setMonthlyData(yearData);
  }, [selectedYear]);

  return (
    <div className="p-6">
      {/* Title and Description */}
      <TitlePage
        title="Báo cáo & Thống kê"
        description="Tổng quan về hiệu suất hệ thống và các chỉ số"
      />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCards
          title="Tổng người dùng"
          number={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />

        <StatsCards
          title="Tổng bài đăng"
          number={stats.totalListings.toLocaleString()}
          icon={<BarChart3 className="h-6 w-6 text-green-600" />}
        />

        <StatsCards
          title="Giao dịch"
          number={stats.totalTransactions.toLocaleString()}
          icon={<TrendingUp className="h-6 w-6 text-yellow-600" />}
        />

        <StatsCards
          title="Tổng doanh thu"
          number={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* Year Selector */}
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="h-80">
            <BarChartComponent
              data={monthlyData.map((item) => item.revenue)}
              title="Doanh thu theo tháng (VND)"
              color="rgba(53, 162, 235, 0.8)"
              year={selectedYear}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="h-80">
            <BarChartComponent
              data={monthlyData.map((item) => item.transactions)}
              title="Số lượng giao dịch theo tháng"
              color="rgba(255, 99, 132, 0.8)"
              year={selectedYear}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsStatistics;
