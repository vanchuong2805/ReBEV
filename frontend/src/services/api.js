import { refreshToken } from "@/features/auth/service";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  
});
api.interceptors.response.use(
  (response) => response, // nếu thành công thì cứ trả về
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Lay api url dang goi
      const originalRequest = error.config;
      if (originalRequest.url !== "/auth/refresh") {
        // Thuc hien refresh token
        const { user, accessToken } = await refreshToken();
        console.log("accessToken");
        localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("user", JSON.stringify(user));
        // Cap nhat lai header Authorization
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("accessToken")}`;
        // Goi lai api ban dau
        return api(originalRequest);
      } else {
        console.log("refreshToken");
        console.log(error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
