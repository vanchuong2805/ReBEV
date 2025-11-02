import api from "@/services/api";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/login/phone`,
    credentials,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const googleLogin = async (id_token) => {
  const response = await api.post("/users/login/google", { id_token });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

export const refreshToken = async () => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const forgetPassword = async (phone) => {
  const response = await api.post("/users/forget-password", { phone });
  return response.data;
};

export const getOTP = async (phone) => {
  const response = await api.post("/users/get-otp", { phone });
  return response.data;
};
