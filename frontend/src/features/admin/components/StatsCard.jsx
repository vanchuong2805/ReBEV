import React from "react";
import { Card } from "../../../components/ui/card";

export default function StatsCard({ number, description, color }) {
  return (
    <>
      <Card className="p-4">
        <div className="text-center">
          <p className={`text-2xl font-bold text-${color}-600`}>{number}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </Card>
    </>
  );
}
