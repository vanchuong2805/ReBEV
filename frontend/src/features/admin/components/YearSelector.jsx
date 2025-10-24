import React from "react";

const YearSelector = ({ selectedYear, onYearChange }) => {
  // Tạo danh sách năm từ 2025 đến 2035
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  return (
    <div className="flex items-center justify-end mb-4">
      <label
        htmlFor="year-select"
        className="mr-2 text-sm font-medium text-gray-700"
      >
        Chọn năm:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
