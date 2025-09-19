import React from "react";
import DoanhThu from "./DoanhThu";
import Chart from "@/components/common/Chart";

export default function MainContent({ h1 }) {
  return (
    <>
      <div
        className="flex-grow-1 p-4"
        style={{ background: "transparent", color: "#fff" }}
      >
        <h2 style={{ color: "black" }}>{h1}</h2>
        <DoanhThu />
        <DoanhThu />
        <Chart />
      </div>
    </>
  );
}
