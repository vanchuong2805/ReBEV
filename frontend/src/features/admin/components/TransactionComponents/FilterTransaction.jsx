import React from "react";

export default function FilterTransaction({
  id,
  label,
  value,
  onChange,
  options,
  className = "",
  labelClassName = "",
  ...rest
}) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
