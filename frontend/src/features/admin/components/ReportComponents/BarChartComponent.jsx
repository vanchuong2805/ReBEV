import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BarChartComponent = ({ data = [], title, color, year, monthly }) => {
  const chartRef = useRef(null);

  // Tạo gradient mềm kiểu Metronic
  const createGradient = (ctx, area) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, color.replace("0.8", "0.2")); // nhạt dưới
    gradient.addColorStop(1, color.replace("0.8", "1")); // đậm trên
    return gradient;
  };

  const chartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color;
          return createGradient(ctx, chartArea);
        },
        borderRadius: 8, // BO GÓC CỘT
        barThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${title} (${year})`,
        font: { size: 16, weight: "600" },
        color: "#1e293b",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        padding: 12,
        displayColors: false,
        callbacks: {
          title: () => "", // 🚀 ẨN title trong tooltip
          label: (ctx) => {
            const value = ctx.raw || 0;
            return monthly
              ? value.toLocaleString("vi-VN") + " VND"
              : value + " giao dịch";
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
          color: "#64748b",
          font: { size: 14, weight: "600" },
          padding: { top: 10 },
        },
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          callback: (value) => value.toLocaleString("vi-VN"),
        },
        grid: { color: "rgba(226,232,240,0.5)" },
      },
    },
  };

  return <Bar ref={chartRef} options={options} data={chartData} />;
};

export default BarChartComponent;
