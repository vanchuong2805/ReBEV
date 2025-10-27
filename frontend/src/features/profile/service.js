import axios from "axios"

const GHN_API = import.meta.env.VITE_GHN_API
const TOKEN = import.meta.env.VITE_GHN_TOKEN

const headers = {
  "Content-Type": "application/json",
  Token: TOKEN,
}

const API_BASE_URL = "https://rebev.up.railway.app/api";

export const fetchProvinces = async () => {
  const res = await axios.get(`${GHN_API}/master-data/province`, { headers })
  return res.data.data.filter(
    (p) => !/\d/.test(p.ProvinceName) && !/test/i.test(p.ProvinceName)
  )
}

export const fetchDistricts = async (province_id) => {
  if (!province_id) return []
  const res = await axios.post(
    `${GHN_API}/master-data/district`,
    { province_id: Number(province_id) },
    { headers }
  )
  return res.data.data
}

export const fetchWards = async (district_id) => {
  if (!district_id) return []
  const res = await axios.post(
    `${GHN_API}/master-data/ward`,
    { district_id: Number(district_id) },
    { headers }
  )
  return res.data.data
}

export const getContactByUserId = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/contacts/${id}`)
  return res.data
}
export const createContact = async (contactData) => {
  const res = await axios.post(`${API_BASE_URL}/contacts/contact-details`, contactData, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  return res.data
}
export const deleteContact = async (id) => {
  const res = await axios.patch(`${API_BASE_URL}/contacts/${id}/delete`)
  return res.data
}
export const updateContact = async (id, data) => {
  const res = await axios.put(
    `${API_BASE_URL}/contacts/update/contact-details`,
    { id, ...data },
    { headers: { "Content-Type": "application/json" } }
  )
  return res.data
}
export const updateProfile = async (id, data) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.put(
    `${API_BASE_URL}/users/${id}/update`,
    { ...data },
    { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
  )
  console.log(data)
  return res.data
}
export const changePassword = async (id, oldPassword, newPassword) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.put(
    `${API_BASE_URL}/users/${id}/update-password`,
    { oldPassword, newPassword },
    { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
  )
  console.log(res)
  return res
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
export const getPostsByUserId = async (userId) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/users/${userId}/posts`,
    { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
  )
  console.log(res.data)
  return res.data
}
export const getFavoritesByUserId = async (userId) => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/favorites/${userId}`,
    { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
  )
  return res.data
}
export async function getPostById(postId) {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/posts/${postId}`)

  return res.data
}
export async function getCategories() {
  const res = await axios.get(`${API_BASE_URL}/categories`)
  console.log(res.data)
  return res.data
}
export async function getOrderByCustomer() {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/orders?type=customer`, {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  })
 console.log(res.data)
  return res.data
}
export async function getOrderBySeller() {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get(`${API_BASE_URL}/orders?type=seller`, {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  })
 console.log(res.data)
  return res.data
}
export async function changeOrderStatus(orderId, status, description) {
  const token = localStorage.getItem("accessToken")
  const res = await axios.post(
    `${API_BASE_URL}/orders/${orderId}/status`,
    { status, description }, 
    {
      headers: {
        "Content-Type": "application/json", "Authorization": `Bearer ${token}`}
  }
  )
  return res.data
}
