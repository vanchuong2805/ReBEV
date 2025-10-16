
export const formatVND = (n) =>
typeof n === "number"
? n === 0
? "Miễn phí"
: `${n.toLocaleString("vi-VN")} VND`
: "0 VND";


// hooks/useUserPackages.js
import { useState } from "react";


export function useUserPackages(initial) {
const [userPackages, setUserPackages] = useState(initial);
const [showAddPackage, setShowAddPackage] = useState(false);
const [newPackage, setNewPackage] = useState({ name: "", privileges: [], price: 0 });


const startEdit = (id) =>
setUserPackages((prev) => prev.map((p) => ({ ...p, isEditing: p.id === id })));


const saveEdit = (id) =>
setUserPackages((prev) => prev.map((p) => (p.id === id ? { ...p, isEditing: false } : p)));


const cancelEdit = (id) => saveEdit(id);


const changePrice = (id, price) =>
setUserPackages((prev) => prev.map((p) => (p.id === id ? { ...p, price: parseFloat(price) || 0 } : p)));


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

//---------------------------------------------------------

