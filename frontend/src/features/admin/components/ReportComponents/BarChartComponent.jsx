import React, { useEffect, useRef } from "react";
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
  console.log(data);

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
    interaction: {
      mode: "index",
      intersect: false,
      axis: "x",
    },
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
          title: () => "", // ẨN title trong tooltip
          label: (ctx) => {
            console.log("check ctx", ctx);
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

  // Hiển thị tooltip khi hover vào nhãn tháng (trục X)
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const canvas = chart.canvas;
    const hoverZone = 42; // chiều cao vùng tính từ đáy biểu đồ xuống khu vực tick/label

    const onMove = (evt) => {
      if (!chart?.scales?.x || !chart?.chartArea) return;
      const { left, right, bottom, top } = chart.chartArea;
      const xScale = chart.scales.x;

      // Tọa độ chuột tương đối trên canvas
      const rect = canvas.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;

      // Nếu hover ngay vùng nhãn trục X, kích hoạt tooltip ở cột tương ứng
      if (x >= left && x <= right && y >= bottom && y <= bottom + hoverZone) {
        // Lấy index gần nhất từ pixel
        const rawIndex = xScale.getValueForPixel(x);
        const index = Math.max(0, Math.min(11, Math.round(rawIndex)));

        const xPos = xScale.getPixelForValue(index);
        const yPos = top + 10; // hiển thị tooltip phía trên trục X

        chart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], {
          x: xPos,
          y: yPos,
        });
        chart.update();
        return;
      }

      // Nếu không ở vùng nhãn, không can thiệp (Chart.js xử lý mặc định)
      // Tuy nhiên nếu ở ngoài toàn bộ chart/canvas, ẩn tooltip tùy chỉnh
      if (y > bottom + hoverZone || x < left || x > right) {
        chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
        chart.update();
      }
    };

    const onLeave = () => {
      chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      chart.update();
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [chartRef, data]);

  return <Bar ref={chartRef} options={options} data={chartData} />;
};

export default BarChartComponent;
