import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { canAccessRoute, getDefaultRoute } from "@/services/routeGuard";
import { ROUTES } from "@/constants/routes";

/**
 * Hook để kiểm tra quyền truy cập route
 * Tự động redirect nếu user không có quyền hoặc chưa có package
 */
export const useRouteGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      return;
    }

    const currentPath = location.pathname;
    const userRole = user.role;

    // Kiểm tra quyền truy cập theo role
    if (!canAccessRoute(userRole, currentPath)) {
      const defaultRoute = getDefaultRoute(userRole);
      navigate(defaultRoute, { replace: true });
      return;
    }

    const needsPackage = currentPath.startsWith("/posts");

    if (needsPackage && (!user.package_id || user.package_id === null)) {
      navigate(ROUTES.UPGRADE, { replace: true, state: { from: location } });
    }
  }, [location, navigate, user]);

  return { user };
};
