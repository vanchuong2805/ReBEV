import React from "react";
import { Routes, Route } from "react-router";
import NotFound from "../features/404Page/NotFound.jsx";
import LoginFormDialog from "../features/auth/components/LoginForm.jsx";
import { ROUTES } from "../constants/routes.js";
import Dashboard from "@/features/admin/pages/Dashboard";
import RegisterForm from "@/features/auth/components/RegisterForm.jsx";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.LOGIN} element={<LoginFormDialog />} />
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
      </Routes>
    </>
  );
}
