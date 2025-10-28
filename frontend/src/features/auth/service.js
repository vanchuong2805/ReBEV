import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/login/phone`,
    credentials
  );
  return response.data;
};

export const googleLogin = async (idToken) => {
  const response = await axios.post(`${API_BASE_URL}/users/login/google`, {
    id_token: idToken,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    `${API_BASE_URL}/users/logout`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};