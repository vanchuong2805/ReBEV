import React from "react";

const SortSelector = ({ value, onChange, options }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelector;
