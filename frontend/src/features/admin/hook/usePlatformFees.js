// hooks/usePlatformFees.js
import { useState } from "react";

export function usePlatformFees(initial) {
  const [platformFees, setPlatformFees] = useState(initial);
  const [selectedCategory, setSelectedCategory] = useState("xe-may-dien");
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setPlatformFees((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  const save = () => {
    setPlatformFees((prev) => {
      const next = { ...prev };
      return next;
    });
    setIsEditing(false);
  };

  return {
    platformFees,
    setPlatformFees,
    selectedCategory,
    setSelectedCategory,
    isEditing,
    setIsEditing,
    handleChange,
    save,
  };
}
