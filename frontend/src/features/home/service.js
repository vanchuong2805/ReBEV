// src/features/posts/service.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getFeaturedProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/posts`);
  return res.data;
};
