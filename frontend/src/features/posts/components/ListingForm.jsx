import React, { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ListingForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [meta, setMeta] = useState("");
  const [badge, setBadge] = useState("");

  // Tạo id theo prefix từ tiêu đề (bike- / bat-), fallback timestamp
  const id = useMemo(() => {
    const t = (title || "").toLowerCase();
    const prefix = t.includes("pin") || t.includes("battery") ? "bat" : "bike";
    return `${prefix}-${Date.now().toString().slice(-6)}`;
  }, [title]);

  // Preview số tiền dạng VNĐ
  const pricePreview = useMemo(() => {
    const n = Number(String(price).replaceAll("_", "").replaceAll(",", ""));
    if (Number.isNaN(n)) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);
  }, [price]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate đơn giản
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề!");
      return;
    }
    const n = Number(String(price).replaceAll("_", "").replaceAll(",", ""));
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Giá phải là số > 0");
      return;
    }
    if (!image.trim()) {
      toast.error("Vui lòng nhập URL ảnh");
      return;
    }

    const listing = {
      id,
      title: title.trim(),
      price: n,
      image: image.trim(),
      meta: meta.trim(),
      badge: badge.trim() || undefined,
    };

    onSubmit?.(listing);

    // reset form
    setTitle("");
    setPrice("");
    setImage("");
    setMeta("");
    setBadge("");
    toast.success("Đã tạo bài đăng!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h5 className="mb-0 text-lg font-semibold">Tạo bài đăng</h5>
        <span className="text-sm text-gray-500">
          ID : <code className="px-1 text-xs bg-gray-100 rounded">{id}</code>
        </span>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tiêu đề
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ví dụ: VinFast VF e34 - 2022"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Giá (VND)
        </label>
        <div className="flex">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1000000 "
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md">
            {pricePreview || "—"}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Ảnh (URL)
        </label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://... "
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {!!image && (
          <div className="mt-2">
            <img
              src={image}
              alt="preview"
              className="object-cover max-w-xs rounded-lg h-30"
              style={{
                maxWidth: 220,
                height: 120,
              }}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Meta (mô tả ngắn)
        </label>
        <input
          type="text"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          placeholder="Ví dụ: Pin 42 kWh, đi được 300 km"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Badge (tùy chọn)
        </label>
        <input
          type="text"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          placeholder="VD: ĐÃ KIỂM ĐỊNH / MỚI VỀ / GIẢM GIÁ"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Đăng
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setPrice("");
            setImage("");
            setMeta("");
            setBadge("");
          }}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Xoá form
        </button>
      </div>
    </form>
  );
}
