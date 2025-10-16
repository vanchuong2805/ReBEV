import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartComponent = ({ data, title, color, year }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${title} (${year})`,
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  const chartData = {
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
        data: data,
        backgroundColor: color,
        borderColor: color.replace("0.8", "1"),
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};

export default BarChartComponent;
