import { Card } from "../../../../components/ui/card";
import React from "react";
export default function StatsCards({ listings }) {
  const pending = listings.filter((l) => l.status === "pending").length;
  const approved = listings.filter((l) => l.status === "approved").length;
  const rejected = listings.filter((l) => l.status === "rejected").length;
  const total = listings.length;

  const items = [
    { value: pending, label: "Chờ duyệt", className: "text-yellow-600" },
    { value: approved, label: "Đã duyệt", className: "text-green-600" },
    { value: rejected, label: "Từ chối", className: "text-red-600" },
    { value: total, label: "Tổng số tin", className: "text-blue-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {items.map((it) => (
        <Card key={it.label} className="p-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${it.className}`}>{it.value}</p>
            <p className="text-sm text-gray-600">{it.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
