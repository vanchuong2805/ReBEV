import api from "@/services/api.js";

// Gắn interceptor trực tiếp lên axios mặc định


export const getCartItems = async (user_id) => {
  const response = await api.get(`/carts/${user_id}`);
  console.log("Cart items fetched successfully:", response.data);
  return response.data;
};

export const deleteCartItem = async (item_id) => {
  const response = await api.delete(`/carts/delete/${item_id}`);
  return response.data;
};

export const getPostById = async (post_id) => {
  const response = await api.get(`/posts/${post_id}`);
  return response.data;
};

export const getContactById = async (id) => {
  const res = await api.get(`/contacts/contact/${id}`);
  return res.data;
};
