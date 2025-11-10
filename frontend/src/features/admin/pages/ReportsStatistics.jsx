import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card } from "../../../components/ui/card";
import StatsCards from "../components/StatsCards";
import TitlePage from "../components/TitlePage";
import BarChartComponent from "../components/ReportComponents/BarChartComponent";
import YearSelector from "../components/YearSelector";
import { getStaticPage } from "../service";
const ReportsStatistics = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const [data, setData] = useState({});
  useEffect(() => {
    const getDataStatic = async () => {
      const data = await getStaticPage(selectedYear);
      setData(data.data);
    };
    getDataStatic();
  }, [selectedYear]);

  console.log(
    data.revenue?.reduce((sum, item) => sum + item.transaction_sum, 0)
  );
  // Hàm dịch mảng lùi 1 bước
  const shiftArrayBackOne = (arr) => {
    if (!arr || arr.length === 0) return arr;
    return [...arr.slice(1), arr[0]];
  };

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
          number={data.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />

        <StatsCards
          title="Tổng bài đăng"
          number={data.totalPosts}
          icon={<BarChart3 className="h-6 w-6 text-green-600" />}
        />

        <StatsCards
          title="Giao dịch"
          number={data.totalTransactions}
          icon={<TrendingUp className="h-6 w-6 text-yellow-600" />}
        />

        <StatsCards
          title="Tổng doanh thu (VNĐ)"
          number={`${data.revenue
            ?.reduce((sum, item) => sum + item.transaction_sum, 0)
            .toLocaleString()} `}
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
              data={shiftArrayBackOne(
                data.monthlyRevenues?.map((month) =>
                  month.reduce(
                    (sum, transaction) => sum + transaction.transaction_sum,
                    0
                  )
                )
              )}
              title="Doanh thu theo tháng (VND)"
              color="rgba(53, 162, 235, 0.8)"
              year={selectedYear}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="h-80">
            <BarChartComponent
              data={shiftArrayBackOne(data.monthlyTransactions)}
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
