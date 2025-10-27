import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCartItems = async (user_id) => {
  const response = await axios.get(`${API_BASE_URL}/carts/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export const deleteCartItem = async (item_id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/carts/delete/${item_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const getPostById = async (post_id) => {
  const response = await axios.get(`${API_BASE_URL}/posts/${post_id}`);
  return response.data;
};

export const getContactById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/contacts/contact/${id}`);
  return res.data;
};
