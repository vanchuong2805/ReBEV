import { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCcw,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import StatsCards from "../components/StatsCards";
import TitlePage from "../components/TitlePage";
import BarChartComponent from "../components/ReportComponents/BarChartComponent";
import YearSelector from "../components/YearSelector";
import { getStaticPage } from "../service";

const nf = new Intl.NumberFormat("vi-VN");
const formatMoney = (v) => (typeof v === "number" ? nf.format(v) : "0");

const ReportsStatistics = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // dịch mảng lùi 1 bước (memo để không render lại vô ích)
  const shiftArrayBackOne = (arr) =>
    Array.isArray(arr) && arr.length ? [...arr.slice(1), arr[0]] : arr ?? [];

  const totals = useMemo(() => {
    const revenue = (data.revenue || []).reduce(
      (s, i) => s + (i?.transaction_sum || 0),
      0
    );
    return {
      users: data.totalUsers || 0,
      posts: data.totalPosts || 0,
      transactions: data.totalTransactions || 0,
      revenue,
    };
  }, [data]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getStaticPage(selectedYear);
        if (!alive) return;
        setData(res?.data || {});
      } catch (e) {
        if (!alive) return;
        setErr("Không tải được dữ liệu. Vui lòng thử lại.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedYear]);

  const monthlyRevenue = useMemo(() => {
    const mr = (data.monthlyRevenues || []).map((month) =>
      (month || []).reduce((sum, t) => sum + (t?.transaction_sum || 0), 0)
    );
    return shiftArrayBackOne(mr);
  }, [data.monthlyRevenues]);

  const monthlyTransactions = useMemo(
    () => shiftArrayBackOne(data.monthlyTransactions || []),
    [data.monthlyTransactions]
  );

  return (
    <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      {/* Title */}
      <div className="mb-6">
        <TitlePage
          title="Báo cáo & Thống kê"
          description="Tổng quan về hiệu suất hệ thống và các chỉ số"
        />
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
            </div>
          ))
        ) : (
          <>
            <StatsCards
              title="Tổng người dùng"
              number={nf.format(totals.users)}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              className="bg-white/90 hover:shadow-lg transition-shadow rounded-2xl border border-slate-200"
            />
            <StatsCards
              title="Tổng bài đăng"
              number={nf.format(totals.posts)}
              icon={<BarChart3 className="h-6 w-6 text-green-600" />}
              className="bg-white/90 hover:shadow-lg transition-shadow rounded-2xl border border-slate-200"
            />
            <StatsCards
              title="Giao dịch"
              number={nf.format(totals.transactions)}
              icon={<TrendingUp className="h-6 w-6 text-yellow-600" />}
              className="bg-white/90 hover:shadow-lg transition-shadow rounded-2xl border border-slate-200"
            />
            <StatsCards
              title="Tổng doanh thu (VNĐ)"
              number={formatMoney(totals.revenue)}
              icon={<DollarSign className="h-6 w-6 text-purple-600" />}
              className="bg-white/90 hover:shadow-lg transition-shadow rounded-2xl border border-slate-200"
            />
          </>
        )}
      </div>

      {/* Year Selector + Refresh */}
      <div className="flex items-center justify-between mb-6">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        <button
          onClick={() => setSelectedYear((y) => `${y}`)} // trigger refetch nhanh
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm transition"
          title="Làm mới dữ liệu"
        >
          <RefreshCcw size={16} /> Làm mới
        </button>
      </div>

      {/* Error state */}
      {err && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3">
          {err}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">
              Doanh thu theo tháng (VND)
            </h3>
            <span className="text-xs text-slate-500">Năm {selectedYear}</span>
          </div>
          <div className="h-80">
            {!loading && monthlyRevenue?.length ? (
              <BarChartComponent
                data={monthlyRevenue}
                title=""
                color="rgba(53, 162, 235, 0.8)"
                year={selectedYear}
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-xl" />
            )}
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">
              Số lượng giao dịch theo tháng
            </h3>
            <span className="text-xs text-slate-500">Năm {selectedYear}</span>
          </div>
          <div className="h-80">
            {!loading && monthlyTransactions?.length ? (
              <BarChartComponent
                data={monthlyTransactions}
                title=""
                color="rgba(255, 99, 132, 0.8)"
                year={selectedYear}
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-xl" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsStatistics;
