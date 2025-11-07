// Route Guard Service
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

// Định nghĩa các route mặc định cho từng role
export const DEFAULT_ROUTES = {
  [ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
  [ROLES.STAFF]: ROUTES.STAFF.DASHBOARD,
  [ROLES.MEMBER]: ROUTES.HOME,
};

/**
 * Redirect user sau khi đăng nhập dựa trên role
 * @param {Object} user - User object từ backend
 * @param {Function} navigate - React Router navigate function
 * @param {string} intendedRoute - Route người dùng muốn đi đến (optional)
 */
export const redirectAfterLogin = (user, navigate, intendedRoute = null) => {
  if (!user) {
    console.error("User object is required for redirectAfterLogin");
    return;
  }

  const userRole = user.role;

  // Nếu có intendedRoute và user có quyền truy cập, đi đến route đó
  if (intendedRoute) {
    if (canAccessRoute(userRole, intendedRoute)) {
      navigate(intendedRoute);
      return;
    }
  }

  // Nếu không, redirect đến trang mặc định theo role
  const defaultRoute = DEFAULT_ROUTES[userRole] || DEFAULT_ROUTES[ROLES.MEMBER];
  navigate(defaultRoute);
};

/**
 * Kiểm tra xem user có quyền truy cập route không
 * @param {number} userRole - Role của user
 * @param {string} route - Route cần kiểm tra
 * @returns {boolean}
 */
export const canAccessRoute = (userRole, route) => {
  // Admin chỉ có thể truy cập /admin routes
  if (userRole === ROLES.ADMIN) {
    // Admin không được vào member routes
    const memberOnlyRoutes = [
      "/profile",
      "/posts",
      "/cart",
      "/checkout",
      "/upgrade",
    ];
    const isMemberRoute = memberOnlyRoutes.some((r) => route.startsWith(r));
    if (isMemberRoute) {
      return false;
    }
    // Admin có thể vào admin routes và public routes
    return true;
  }

  // Staff không thể truy cập /admin
  if (userRole === ROLES.STAFF) {
    return !route.startsWith("/admin");
  }

  // Member không thể truy cập /admin và /staff
  if (userRole === ROLES.MEMBER) {
    return !route.startsWith("/admin") && !route.startsWith("/staff");
  }

  return false;
};

/**
 * Lấy route mặc định theo role
 * @param {number} userRole - Role của user
 * @returns {string}
 */
export const getDefaultRoute = (userRole) => {
  return DEFAULT_ROUTES[userRole] || DEFAULT_ROUTES[ROLES.MEMBER];
};

/**
 * Kiểm tra xem user có phải admin không
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

/**
 * Kiểm tra xem user có phải staff không
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isStaff = (user) => {
  return user?.role === ROLES.STAFF;
};

/**
 * Kiểm tra xem user có phải member không
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isMember = (user) => {
  return user?.role === ROLES.MEMBER;
};
