import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getPackage = async () => {
  const res = await axios.get(`${API_BASE_URL}/packages`);
  return res.data;
};
export const createRegisterPackage = async (user_id, package_id) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(`${API_BASE_URL}/users/${user_id}/register-package/${package_id}`, {"redirectUrl": `${window.location.origin}`}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
