// src/features/home/service.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getFeaturedProducts = async (query) => {
  const res = await axios.get(`${API_BASE_URL}/posts`, { params: query });
  console.log(res);
  return res.data;
};
export async function addFavorite(userId, post_id) {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${API_BASE_URL}/favorites/${userId}`,
    { post_id },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
}
export async function removeFavorite(post_id) {
  const token = localStorage.getItem("accessToken");
  const res = await axios.delete(
    `${API_BASE_URL}/favorites/delete/${post_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
export const getFavoritesByUserId = async (userId) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/favorites/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.data);
  return res.data;
};
