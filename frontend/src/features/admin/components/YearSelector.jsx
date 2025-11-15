import React from "react";

const YearSelector = ({ selectedYear, onYearChange }) => {
  const currentYear = new Date().getFullYear(); // Năm hiện tại
  const startYear = 2025;

  // Tạo danh sách năm từ 2025 → năm hiện tại
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

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
