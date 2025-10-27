import { useEffect, useState } from "react";
import axios from "axios";

// hooks/useUserPackages.js

export function useUserPackages(initial) {
  const [userPackages, setUserPackages] = useState(initial);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: "",
    privileges: [],
    price: 0,
  });

  const startEdit = (id) =>
    setUserPackages((prev) =>
      prev.map((p) => ({ ...p, isEditing: p.id === id }))
    );

  const saveEdit = (id) =>
    setUserPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEditing: false } : p))
    );

  const cancelEdit = (id) => saveEdit(id);

  const changePrice = (id, price) =>
    setUserPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: parseFloat(price) || 0 } : p
      )
    );

  const togglePrivilege = (label) =>
    setNewPackage((prev) => ({
      ...prev,
      privileges: prev.privileges.includes(label)
        ? prev.privileges.filter((x) => x !== label)
        : [...prev.privileges, label],
    }));

  const add = () => {
    if (!newPackage.name) return;
    const pkg = {
      id: Date.now(),
      name: newPackage.name,
      privileges: newPackage.privileges,
      price: parseFloat(newPackage.price) || 0,
      isEditing: false,
    };
    setUserPackages((prev) => [...prev, pkg]);
    setNewPackage({ name: "", privileges: [], price: 0 });
    setShowAddPackage(false);
  };

  return {
    userPackages,
    setUserPackages,
    showAddPackage,
    setShowAddPackage,
    newPackage,
    setNewPackage,
    startEdit,
    saveEdit,
    cancelEdit,
    changePrice,
    togglePrivilege,
    add,
  };
}

const baseAPI = "https://rebev.up.railway.app/api";
//---------------------------------------------------------
// LOGOUT

export const logoutAdmin = async () => {
  const token = localStorage.getItem("token"); // lấy token đã lưu sau khi login
  try {
    const res = await axios.post(
      `${baseAPI}/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Logout successful:", res.data);
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
  } catch (err) {
    console.error("Error logging out:", err.response?.data || err.message);
  }
};

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

export function useAllUsers() {
  const [users, setUsers] = useState([]);
  async function getUsersWithAxios() {
    try {
      const res = await axios.get("https://rebev.up.railway.app/api/users");
      setUsers(res.data); // cập nhật state
      console.log(res.data);
    } catch (err) {
      console.error("Axios error:", err.response?.data ?? err.message);
    }
  }

  useEffect(() => {
    getUsersWithAxios();
  }, []);

  return users;
}

export const fetchUsers = async () => {
  const res = await axios.get(baseAPI + "/users");
  return res.data;
};

export const createUser = async (userData) => {
  const res = await axios.post(
    "https://rebev.up.railway.app/api/users",
    userData
  );
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

export const fetchPost = async () => {
  const res = await axios.get(baseAPI + "/posts");
  return res.data.data;
};

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
export const getOrders = async () => {
  const token = localStorage.getItem("accessToken"); // lấy token đã lưu sau khi login
  try {
    const res = await axios.get(`${baseAPI}/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // thêm token vào header
      },
    });
    console.log("Fetched orders:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching orders:", err.response?.data || err.message);
    throw err;
  }
};
