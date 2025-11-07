import axios from "axios"

const GHN_API = import.meta.env.VITE_GHN_API
const TOKEN = import.meta.env.VITE_GHN_TOKEN

const headers = {
  "Content-Type": "application/json",
  Token: TOKEN,
}

const API_BASE_URL = "https://rebev.up.railway.app/api";

export const getBases = async () => {
  const res = await axios.get(`${API_BASE_URL}/bases`)
  return res.data
}
export const getUserById = async (id) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/users/${id}`)
  return res.data
}
export const getContactByUserId = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/contacts/${id}`)
  return res.data
}
// service.js
export const getPosts = async (filters = {}) => {
  const res = await axios.get(`${API_BASE_URL}/posts`, {
    params: filters, // 👈 Tự động build query ?user_id=5&status=1
  })
  return res.data.data
}
export const getContactById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/contacts/contact/${id}`)
  return res.data
}