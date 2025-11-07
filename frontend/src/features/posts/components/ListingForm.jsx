// src/components/ListingForm.jsx
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Form from "@/features/posts/components/Form";
import { categoriesService } from "@/features/posts/service";

export default function ListingForm({ onSubmit }) {
  const [category, setCategory] = useState(1); // luôn dùng number
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          // Giữ kiểu number
          setCategory(Number(data[0].id));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục. Sử dụng danh mục mặc định.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (formData) => {
    const finalListing = { category, ...formData };
    onSubmit?.(finalListing);
    toast.success("Đã tạo bài đăng thành công!");
  };

  const requireBase = Number(category) === 1;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h5 className="mb-0 text-lg font-semibold">Tạo bài đăng đồ cũ</h5>
      </div>

      {/* Chọn danh mục */}
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Bạn muốn đăng bán gì?
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <option>Đang tải danh mục...</option>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id} value={Number(cat.id)}>
                {cat.name}
              </option>
            ))
          ) : (
            <></>
          )}
        </select>
      </div>

      {/* Form bài đăng */}
      <Form
        key={category} // remount khi đổi danh mục để reset state bên trong
        categoryId={Number(category)}
        requireBase={requireBase}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
