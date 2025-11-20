import axios from "axios";

const GHN_API = import.meta.env.VITE_GHN_API;
const TOKEN = import.meta.env.VITE_GHN_TOKEN;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const headers = {
  "Content-Type": "application/json",
  Token: TOKEN,
};

//  GHN (Địa chỉ, Tỉnh/Huyện/Xã)
export const fetchProvinces = async () => {
  const res = await axios.get(`${GHN_API}/master-data/province`, { headers });
  return res.data.data.filter(
    (p) => !/\d/.test(p.ProvinceName) && !/test/i.test(p.ProvinceName)
  );
};

export const fetchDistricts = async (province_id) => {
  if (!province_id) return [];
  const res = await axios.post(
    `${GHN_API}/master-data/district`,
    { province_id: Number(province_id) },
    { headers }
  );
  return res.data.data;
};

export const fetchWards = async (district_id) => {
  if (!district_id) return [];
  const res = await axios.post(
    `${GHN_API}/master-data/ward`,
    { district_id: Number(district_id) },
    { headers }
  );
  return res.data.data;
};

//  CONTACT

export const getContactByUserId = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/contacts/${id}`);
  return res.data;
};

export const createContact = async (contactData) => {
  const res = await axios.post(
    `${API_BASE_URL}/contacts/contact-details`,
    contactData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteContact = async (id) => {
  const res = await axios.patch(`${API_BASE_URL}/contacts/${id}/delete`);
  return res.data;
};

export const updateContact = async (id, data) => {
  const res = await axios.put(
    `${API_BASE_URL}/contacts/update/contact-details`,
    { id, ...data },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};
export const setDefaultContact = async (id) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.patch(
    `${API_BASE_URL}/contacts/${id}/set-default`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
//  USER
export const updateProfile = async (id, data) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.put(
    `${API_BASE_URL}/users/${id}/update`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const changePassword = async (id, oldPassword, newPassword) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.put(
    `${API_BASE_URL}/users/${id}/update-password`,
    { oldPassword, newPassword },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getUserById = async (userId) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

//  POSTS
export const getPosts = async (filters = {}) => {
  const res = await axios.get(`${API_BASE_URL}/posts`, { params: filters });
  return res.data.data;
};

export const getPostById = async (postId) => {
  const res = await axios.get(`${API_BASE_URL}/posts/${postId}`);
  return res.data;
};

export const getPostsByUserId = async (userId) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/users/${userId}/posts`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories`);
  return res.data;
};

export const updatePostVisibility = async (postId) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.patch(
    `${API_BASE_URL}/posts/${postId}/visibility`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
export const updatePostById = async (postId, data) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.patch(
    `${API_BASE_URL}/posts/${postId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
 export const changePostById = async (postId,status) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.patch(`${API_BASE_URL}/posts/${postId}/status`, { status}, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

//  ORDERS

export const getOrderByCustomer = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(
    `${API_BASE_URL}/orders?type=customer&order_type=1&order_type=2&priority=PAID`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
};

export const getOrderBySeller = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(
    `${API_BASE_URL}/orders?type=seller&order_type=1&order_type=2&priority=PAID`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
};
export const getOrderBySellerRefunds = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(
    `${API_BASE_URL}/orders?type=seller&order_type=3`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
};

export const getOrderById = async (orderId) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const changeOrderStatus = async (orderId, status, description,media) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${API_BASE_URL}/orders/${orderId}/status`,
    { status, description, media },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

//  REVIEWS
export const createReview = async (user_id, order_detail_id, rating, comment) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${API_BASE_URL}/order-details/${user_id}/review`,
    { order_detail_id, rating, comment },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
export const updateReview = async (review_id, rating, comment) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.put(
    `${API_BASE_URL}/user-reviews/${review_id}/`,
    { rating, comment },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
//  COMPLAINTS
export const createComplaint = async ({ order_detail_id, description, media }) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${API_BASE_URL}/complaints`,
    {
      order_detail_id,
      complaint_type: 0,
      description,
      media,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getComplaintByUserId = async (user_id) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/users/${user_id}/complaints`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
//  TRANSACTIONS
export const getTransactionByUserId = async (user_id) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/users/${user_id}/transactions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const createWithdraw = async (user_id, amount) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${API_BASE_URL}/users/${user_id}/withdraw`,
    {amount: Number(amount)},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
//appointments
export const updateAppointmentTim = async (order_id,appointment_time) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.put(
    `${API_BASE_URL}/order-details/${order_id}/appointmentTime`,
    { appointment_time },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
//packages
export const getPackages = async () => {
  const res = await axios.get(`${API_BASE_URL}/packages`);
  return res.data;
}