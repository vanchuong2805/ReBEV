import React, { useState } from "react";
// Bạn có thể dùng react-icons hoặc bất kỳ thư viện icon nào bạn thích
import { FaFacebookF, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "32px 24px",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          minWidth: "320px",
          width: "100%",
          maxWidth: "350px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Đăng nhập</h2>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "18px",
          }}
        >
          Đăng nhập
        </button>
        <div
          style={{ textAlign: "center", marginBottom: "12px", color: "#888" }}
        >
          Hoặc đăng nhập bằng
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#e3e3e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaFacebookF color="#1976d2" size={20} />
          </div>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#e3e3e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaEnvelope color="#d44638" size={20} />
          </div>
        </div>
      </form>
    </div>
  );
}
