import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * ProtectedRoute Component - Chặn truy cập dựa trên role và package
 * @param {React.ReactNode} children - Component con cần bảo vệ
 * @param {Array<number>} allowedRoles - Danh sách roles được phép truy cập
 * @param {boolean} requiresPackage - Route có yêu cầu user phải có package không
 */
export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requiresPackage = false,
}) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // Tính toán các điều kiện redirect
  const notLoggedIn = !user;
  const userRole = user?.role;
  const notAllowedRole = user && !allowedRoles.includes(userRole);
  const needsPackageRedirect =
    user && requiresPackage && (!user.package_id || user.package_id === null);

  // Show toast khi cần package
  useEffect(() => {
    if (needsPackageRedirect) {
      toast.error("Bạn cần đăng ký gói trước khi sử dụng tính năng này");
    }
  }, [needsPackageRedirect]);

  // Nếu chưa đăng nhập
  if (notLoggedIn) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  // Kiểm tra role có được phép truy cập không
  if (notAllowedRole) {
    // Redirect về trang mặc định theo role
    let redirectPath = ROUTES.HOME;

    if (userRole === ROLES.ADMIN) {
      redirectPath = ROUTES.ADMIN.DASHBOARD;
    } else if (userRole === ROLES.STAFF) {
      redirectPath = ROUTES.STAFF.DASHBOARD;
    }

    return <Navigate to={redirectPath} replace />;
  }

  // Kiểm tra package nếu route yêu cầu
  if (needsPackageRedirect) {
    // Redirect về trang upgrade nếu chưa có package
    return <Navigate to={ROUTES.UPGRADE} state={{ from: location }} replace />;
  }

  return children;
}
