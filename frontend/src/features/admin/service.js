import axios from "axios";

// hooks/useUserPackages.js

const baseAPI = import.meta.env.VITE_BASE_URL;
//---------------------------------------------------------

// GET FULL PACKAGE

export async function getFullPackage() {
  try {
    const res = await axios.get("https://rebev.up.railway.app/api/packages");
    return res.data;
  } catch (err) {
    console.error("Axios error:", err.response?.data ?? err.message);
  }
}

export const createPackage = async (packageData) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  console.log("Creating package with data:", packageData);
  console.log("Using token:", token);
  try {
    const res = await axios.post(
      `${baseAPI}/packages/create`,
      {
        name: packageData.name,
        description: packageData.description,
        price: packageData.price,
        highlight: packageData.highlight,
        top: packageData.top,
        duration: packageData.duration,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("Package created:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error creating package:", err.response?.data || err.message);
    throw err;
  }
};
export const deletePackage = async (packageId) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  console.log("Deleting package with ID:", packageId);
  console.log("Using token:", token);
  try {
    const res = await axios.patch(
      `${baseAPI}/packages/${packageId}/delete`,
      {}, // body rỗng (vì chỉ cần đổi trạng thái is_Lock)
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("User locked:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error deleting package:", err.response?.data || err.message);
    throw err;
  }
};
export const updatePackage = async (packages) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  console.log("Updating package with ID:", packages.id);
  console.log("Using token:", token);
  try {
    const res = await axios.put(
      `${baseAPI}/packages/${packages.id}/update`,
      {
        name: packages.name,
        description: packages.description,
        price: packages.price,
        highlight: packages.highlight,
        top: packages.top,
        duration: packages.duration,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("Package updated:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error updating package:", err.response?.data || err.message);
    throw err;
  }
};

//_________________________________________

// GET all users

export const fetchUserById = async (userId) => {
  const res = await axios.get(`${baseAPI}/users/${userId}`);
  return res.data;
};

export const fetchUsers = async () => {
  const res = await axios.get(baseAPI + "/users");
  return res.data;
};

export const lockUserAccount = async (userId) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login

  try {
    const res = await axios.patch(
      `${baseAPI}/users/${userId}/lock-account`,
      {}, // body rỗng (vì chỉ cần đổi trạng thái is_Lock)
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("User locked:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error locking user:", err.response?.data || err.message);
    throw err;
  }
};
export const unLockUserAccount = async (userId) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login

  try {
    const res = await axios.patch(
      `${baseAPI}/users/${userId}/unlock-account`,
      {}, // body rỗng (vì chỉ cần đổi trạng thái is_Lock)
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("User unlocked:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error unlocking user:", err.response?.data || err.message);
    throw err;
  }
};

export const createStaffAccount = async (staff) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  console.log("Creating staff with email:", staff.email, "phone:", staff.phone);
  console.log("Using token:", token);
  try {
    const res = await axios.post(
      `${baseAPI}/users/register-staff`,
      { email: staff.email, phone: staff.phone },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("Staff account created:", res.data);
    return res.data;
  } catch (err) {
    console.error(
      "Error creating staff account:",
      err.response?.data || err.message
    );
    throw err;
  }
};

//POST-----------

export const fetchPost = async (searchKey) => {
  const apiPost = baseAPI + "/posts" + (searchKey ? searchKey : "");
  const res = await axios.get(apiPost);
  return res.data.data;
};
//"/posts?status=1&category_id=1&user_id=5&search=đời&page=2&limit=1"

export const updatePostStatus = async (postId, newStatus) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  try {
    const res = await axios.patch(
      `${baseAPI}/posts/${postId}/status`,
      { status: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );

    console.log("Updated:", res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};
//-----------------------------------------
export const getOrders = async (type) => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  try {
    const res = await axios.get(
      `${baseAPI}/orders?page=1&limit=20&order_type=${type}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // thêm token vào header
        },
      }
    );
    console.log("Fetched orders:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching orders:", err.response?.data || err.message);
    throw err;
  }
};

export const fetchOrder = () => {
  const res = axios.get(`${baseAPI}/orders`);
  return res.data;
};
//.---
// Update contractFile
// https://rebev.up.railway.app/api/order-details/:id/contract
export const updateContractFile = async (id, url) => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.patch(
    `${baseAPI}/order-details/${id}/contract`,
    { contract_file: url },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // thêm token vào header
      },
    }
  );
  return res.data;
};
