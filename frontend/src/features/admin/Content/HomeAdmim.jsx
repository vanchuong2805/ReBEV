import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "@/components/common/Chart";

export default function HomeAdmim() {
  return (
    <>
      <h1 className="mb-3">Trang Chủ Admin</h1>

      {/* Layout 2 cột: 2 cards doanh thu bên trái, biểu đồ bên phải */}
      <div className="row">
        {/* Cột trái - 2 cards doanh thu xếp dọc */}
        <div className="col-md-4">
          {/* Card 1 - Total Balance */}
          <div className="card bg-dark text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Balance</h5>
              <p className="card-text fs-4 fw-bold">$176,676.72</p>
              <div className="d-flex justify-content-between">
                <span>Crypto: $76,676.72</span>
                <span>Fiat: $100,000.72</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Monthly Revenue */}
          <div className="card bg-dark text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Monthly Revenue</h5>
              <p className="card-text fs-4 fw-bold">$42,000.00</p>
              <div className="d-flex justify-content-between">
                <span>This Month: +15%</span>
                <span>Growth: 📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải - Biểu đồ */}
        <div className="col-md-8">
          <Chart />
        </div>
      </div>
    </>
  );
}
