import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import Login from "./components/common/Login";
import AdminSidebar from "@/features/admin/pages/AdminSidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BackGround from "./features/admin/pages/BackGround";
import Dashboard from "./features/admin/pages/Dashboard";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
