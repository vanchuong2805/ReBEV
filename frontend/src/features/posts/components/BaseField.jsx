// BaseField.jsx - Component cho cơ sở kiểm định
import React from "react";
import { MyInput } from "./MyInput";

export default function BaseField({ bases, baseId, onBaseChange }) {
  return (
    <div className="flex flex-col gap-1 sm:col-span-2">
      <span className="text-sm font-medium text-gray-700">
        Cơ sở kiểm định <span className="text-red-500">*</span>
      </span>
      <MyInput
        options={bases.map((b) => ({
          id: b.id,
          value: b.id,
          label: `${b.name ?? "Cơ sở"} — ${b.detail}, ${b.ward_name}, ${
            b.district_name
          }, ${b.province_name}`,
        }))}
        value={baseId || ""}
        onChange={onBaseChange}
        placeholder="Chọn cơ sở kiểm định"
        allowFreeText={false}
        className="w-full"
      />
    </div>
  );
}
