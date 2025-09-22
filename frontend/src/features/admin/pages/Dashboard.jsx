import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BackGround from "@/features/admin/pages/BackGround";
import AdminSidebar from "./AdminSidebar";
import DoanhThu from "./DoanhThu";
import HomeAdmim from "../Content/HomeAdmim";
import ManageUser from "../Content/ManageUser";

function Home() {
  return (
    <>
      <HomeAdmim />
    </>
  );
}
function Users() {
  return <ManageUser />;
}
function Posts() {
  return <h1 className="mb-3">Quản lý tin đăng</h1>;
}
function Deals() {
  return <h1 className="mb-3">Quản lý giao dịch</h1>;
}
function Fees() {
  return <h1 className="mb-3">Quản lý phí & hoa hồng</h1>;
}
function Reports() {
  return <h1 className="mb-3">Thống kê & Báo cáo</h1>;
}

export default function Dashboard() {
  const [active, setActive] = useState("home");

  const renderContent = () => {
    switch (active) {
      case "users":
        return <Users />;
      case "posts":
        return <Posts />;
      case "deals":
        return <Deals />;
      case "fees":
        return <Fees />;
      case "reports":
        return <Reports />;
      default:
        return <Home />;
    }
  };

  return (
    <BackGround>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <AdminSidebar active={active} onSelect={setActive} />
        <main className="flex-grow-1 p-4">
          {renderContent()}
          {/* nội dung chi tiết của từng trang để dưới đây */}
          <div className="card shadow-sm"></div>
        </main>
      </div>
    </BackGround>
  );
}
