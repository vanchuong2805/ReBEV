// import { refreshToken } from "@/features/auth/service";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,

// });
// api.interceptors.response.use(
//   (response) => response, // nếu thành công thì cứ trả về
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       // Lay api url dang goi
//       const originalRequest = error.config;
//       if (originalRequest.url !== "/auth/refresh") {
//         // Thuc hien refresh token
//         const { user, accessToken } = await refreshToken();
//         console.log("accessToken");
//         localStorage.setItem("accessToken", accessToken);
//         // localStorage.setItem("user", JSON.stringify(user));
//         // Cap nhat lai header Authorization
//         originalRequest.headers[
//           "Authorization"
//         ] = `Bearer ${localStorage.getItem("accessToken")}`;
//         // Goi lai api ban dau
//         return api(originalRequest);
//       } else {
//         console.log("refreshToken");
//         console.log(error);
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("user");
//         window.location.href = "/";
//       }
//     }
//     return Promise.reject(error);
//   }
// );
// export default api;
// src/services/api.js
import axios from "axios";
import { refreshToken } from "@/features/auth/service";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ---- Single-flight lock cho refresh để tránh gọi trùng ----
let refreshPromise = null;

// ---- Request interceptor: gắn Authorization nếu có ----
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: tự động refresh khi 401 ----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Lỗi mạng/CORS không có error.response
    if (!error?.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config || {};

    // Đừng tự refresh nếu chính refresh endpoint bị 401, hoặc đã thử lại rồi
    const url = (originalRequest?.url || "").toString();
    const isRefreshCall = url.includes("/users/refresh");

    if (status !== 401 || isRefreshCall || originalRequest._retry) {
      return Promise.reject(error);
    }

    try {
      // Đánh dấu đã retry để tránh loop
      originalRequest._retry = true;

      // Nếu đang có refresh đang chạy → chờ kết quả đó
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { accessToken } = await refreshToken(); // <- axios riêng
          // Lưu & cập nhật header mặc định của instance
          localStorage.setItem("accessToken", accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          return accessToken;
        })().finally(() => {
          // reset lock khi xong (thành công hoặc thất bại)
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      // Gắn token mới vào request cũ rồi gửi lại
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (e) {
      // Refresh thất bại → dọn state và chuyển về trang chủ/đăng nhập
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } finally {
        // Tránh dùng history APIs nếu app bạn muốn hard reload
        window.location.href = "/";
      }
      return Promise.reject(e);
    }
  }
);

export default api;
