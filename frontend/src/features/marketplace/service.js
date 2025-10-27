import axios from "axios"

const GHN_API = import.meta.env.VITE_GHN_API
const TOKEN = import.meta.env.VITE_GHN_TOKEN

const headers = {
  "Content-Type": "application/json",
  Token: TOKEN,
}

const API_BASE_URL = "https://rebev.up.railway.app/api";
export const getPostById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/posts/${id}`)
  console.log(res.data)
  return res.data
}
export const getVariations = async () => {
  const res = await axios.get(`${API_BASE_URL}/variations`)
  return res.data
}
export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories`)
  return res.data
}
export const getBases = async () => {
  const res = await axios.get(`${API_BASE_URL}/bases`)
  return res.data
}
export const getUserById = async (id) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/users/${id}`,)
  return res.data
}
export const getContactById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/contacts/contact/${id}`)
  return res.data
}
export const getPosts = async (filters = {}) => {
  

  const res = await axios.get(`${API_BASE_URL}/posts`, {
    params: filters,
  })

  return res.data.data
}
export const updatePostVisibility = async (postId) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.patch(`${API_BASE_URL}/posts/${postId}/visibility`, {},
    { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
  )
  console.log(res.data)
  return res.data
}
export const addCarts = async (userId, post_id) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.post(`${API_BASE_URL}/carts/${userId}`, { post_id },
    { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
  )
  return res.data
}