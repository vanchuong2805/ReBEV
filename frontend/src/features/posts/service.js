// src/features/posts/service.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL; // posts, categories...

export async function createPost({ payload }) {
  const res = await axios.post(`${API_BASE_URL}/posts`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
}

export const categoriesService = {
  getCategories: async () => {
    const res = await axios.get(`${API_BASE_URL}/categories`);
    return res.data;
  },
  getCategoryById: async (id) => {
    const res = await axios.get(`${API_BASE_URL}/categories/${id}`);
    return res.data;
  },
};

export const basesService = {
  getAllBases: async () => {
    const res = await axios.get(`${API_BASE_URL}/bases`);
    return res.data;
  },
};

// === Variation Values ===
// Trả về mảng (id, variation_id, parent_id, value)
export async function getVariationValues() {
  const res = await axios.get(`${API_BASE_URL}/variationValues`);
  return res.data;
}

export async function getVariationValueById(id) {
  const res = await axios.get(
    `${API_BASE_URL}/variationValues?variationId=${id}`
  );
  return res.data;
}

export async function getVariationValueByParentId(parentId) {
  const res = await axios.get(
    `${API_BASE_URL}/variationValues?parentId=${parentId}`
  );
  return res.data;
}

export async function getVariationNameByCategoryId(categoryId) {
  const res = await axios.get(
    `${API_BASE_URL}/variations?categoryId=${categoryId}`
  );
  return res.data;
}

// === Contacts ===
export async function getContactsByUserId(userId) {
  const res = await axios.get(`${API_BASE_URL}/contacts/${userId}`);
  return res.data;
}
