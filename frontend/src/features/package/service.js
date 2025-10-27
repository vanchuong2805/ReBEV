import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getPackage = async () => {
  const res = await axios.get(`${API_BASE_URL}/packages`);
  return res.data;
};
