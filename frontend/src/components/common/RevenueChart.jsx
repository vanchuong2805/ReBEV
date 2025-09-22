import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Đăng ký các component cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart() {
  // Dữ liệu mẫu doanh thu theo tháng (có thể thay thế bằng dữ liệu thực từ API)
  const revenueData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [
          15000000, 18000000, 22000000, 19000000, 25000000, 28000000, 32000000,
          29000000, 35000000, 31000000, 38000000, 42000000,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Doanh Thu Từng Tháng",
        color: "#fff",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return `Doanh thu: ${value.toLocaleString("vi-VN")} VNĐ`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 11,
          },
          callback: function (value) {
            return (value / 1000000).toFixed(0) + "M";
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
  };

  return (
    <div className="card bg-dark text-white mb-3">
      <div className="card-body">
        <div style={{ position: "relative", height: "400px" }}>
          <Bar data={revenueData} options={options} />
        </div>
      </div>
    </div>
  );
}
