import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DoanhThu() {
  return (
    <>
      <div className="row mt-4">
        <div className="col-md-4">
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
        </div>
      </div>
    </>
  );
}
