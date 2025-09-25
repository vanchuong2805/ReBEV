import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import AppRoutes from "./app/AppRoutes.jsx";
import { BrowserRouter } from "react-router";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
