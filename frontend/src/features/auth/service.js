import axios from "axios";

const API_BASE_URL = "https://rebev.up.railway.app/api/users";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/login/phone`, credentials);
  return response.data;
};
