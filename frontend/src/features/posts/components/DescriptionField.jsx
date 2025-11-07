// DescriptionField.jsx - Component cho mô tả chi tiết
import React from "react";
import TiptapEditor from "@/components/common/TiptapEditor";

export default function DescriptionField({ description, onDescriptionChange }) {
  return (
    <div className="pt-4 border-t">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Mô tả chi tiết
      </label>
      <TiptapEditor
        style={{ whiteSpace: "pre-wrap" }}
        content={description}
        onChange={onDescriptionChange}
        placeholder="Nhập mô tả chi tiết về sản phẩm..."
      />
    </div>
  );
}
