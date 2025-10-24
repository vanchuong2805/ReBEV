import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./app/AppRoutes";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppRoutes />
    
  </BrowserRouter>
);
