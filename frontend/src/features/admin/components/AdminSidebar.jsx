import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminSidebar({ active, onSelect }) {
  const Item = ({ id, icon, label }) => (
    <li className="nav-item">
      <button
        type="button"
        className={`nav-link text-start w-100 ${
          active === id ? "active" : "text-white"
        }`}
        style={{
          background: active === id ? "#2e5bff" : "transparent",
          border: "none",
        }}
        onClick={() => onSelect(id)}
        aria-current={active === id ? "page" : undefined}
      >
        <i className={`${icon} me-2`}></i>
        {label}
      </button>
    </li>
  );

  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 text-white"
      style={{ width: "260px", background: "#23284a" }}
    >
      <span className="fs-4 fw-bold">Trang Chủ Admin</span>
      <hr style={{ borderColor: "#2e345c" }} />
      <ul className="nav nav-pills flex-column mb-auto">
        <Item id="home" icon="bi bi-house" label="Trang Chủ" />
        <Item id="users" icon="bi bi-people" label="Quản lý người dùng" />
        <Item
          id="posts"
          icon="bi bi-file-earmark-text"
          label="Quản lý tin đăng"
        />
        <Item
          id="deals"
          icon="bi bi-arrow-left-right"
          label="Quản lý giao dịch"
        />
        <Item
          id="fees"
          icon="bi bi-cash-stack"
          label="Quản lý phí & hoa hồng"
        />
        <Item id="reports" icon="bi bi-archive" label="Thống kê & Báo cáo" />
      </ul>
      <hr style={{ borderColor: "#2e345c" }} />
      <button
        type="button"
        className="nav-link text-white text-start w-100"
        style={{ background: "transparent", border: "none" }}
        onClick={() => onSelect("home")}
      >
        Logout
      </button>
    </aside>
  );
}
