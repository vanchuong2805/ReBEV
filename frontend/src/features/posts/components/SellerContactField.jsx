// SellerContactField.jsx - Component cho địa chỉ người bán
import React from "react";
import { MyInput } from "./MyInput";

export default function SellerContactField({
  contacts,
  sellerContactId,
  onContactChange,
}) {
  return (
    <div className="flex flex-col gap-1 sm:col-span-2">
      <span className="text-sm font-medium text-gray-700">
        Địa chỉ người bán <span className="text-red-500">*</span>
      </span>
      <MyInput
        options={(contacts || []).map((c) => ({
          id: c.id,
          value: c.id,
          label: `${c.name} — ${c.phone} — ${c.detail}, ${c.ward_name}, ${c.district_name}, ${c.province_name}`,
        }))}
        value={sellerContactId || ""}
        onChange={onContactChange}
        placeholder="Chọn liên hệ người bán"
        allowFreeText={false}
        className="w-full"
      />
    </div>
  );
}
