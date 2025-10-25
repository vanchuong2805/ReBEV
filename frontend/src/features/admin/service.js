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

// GET FULL PACKAGE

export function useFullPackage() {
  const [userPackagesAPI, setUserPackagesAPI] = useState([]);
  async function getPackagesWithAxios() {
    try {
      const res = await axios.get("https://rebev.up.railway.app/api/packages");
      setUserPackagesAPI(res.data); // cập nhật state
      console.log(res.data);
    } catch (err) {
      console.error("Axios error:", err.response?.data ?? err.message);
    }
  }

  useEffect(() => {
    getPackagesWithAxios();
  }, []);

  return userPackagesAPI;
}

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
//POST-----------
export const fetchPost = async () => {
  const res = await axios.get(baseAPI + "/posts");
  return res.data;
};
