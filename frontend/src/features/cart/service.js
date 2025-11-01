import api from "@/services/api.js";

// Gắn interceptor trực tiếp lên axios mặc định

export const getCartItems = async (user_id) => {
  const response = await api.get(`/carts/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  console.log("Cart items fetched successfully:", response.data);
  return response.data;
};

export const deleteCartItem = async (item_id) => {
  const response = await api.delete(`/carts/delete/${item_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export const getPostById = async (post_id) => {
  const response = await api.get(`/posts/${post_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export const getContactById = async (id) => {
  const res = await api.get(`/contacts/contact/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};
