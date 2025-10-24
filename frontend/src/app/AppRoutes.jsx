import React from "react";
import { Routes, Route } from "react-router";
import NotFound from "../features/404Page/NotFound.jsx";
import LoginFormDialog from "../features/auth/components/LoginForm.jsx";
import { ROUTES } from "../constants/routes.js";
import RegisterForm from "@/features/auth/components/RegisterForm.jsx";
import ProfilePage from "@/features/profile/pages/ProfilePage.jsx";
import AdminPage from "@/features/admin/pages/AdminPage.jsx";
export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.LOGIN} element={<LoginFormDialog />} />
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Routes>
    </>
  );
}
