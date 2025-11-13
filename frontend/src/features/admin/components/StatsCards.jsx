import React from "react";
import { Card } from "../../../components/ui/card";

export default function StatsCards({ title, number, icon }) {
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{number}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center"></div>
      </Card>
    </>
  );
}
