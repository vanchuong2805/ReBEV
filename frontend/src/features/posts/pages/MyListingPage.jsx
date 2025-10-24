import React, { useState } from "react";
import { toast } from "sonner";
import ListingForm from "../components/ListingForm.jsx";
//import Gallery from "../components/Gallery.jsx";

export default function MyListingPage() {
  const [items, setItems] = useState([]);

  const handleAdd = (listing) => {
    // chặn trùng id
    setItems((prev) => {
      if (prev.some((x) => x.id === listing.id)) {
        toast.error("ID bị trùng, vui lòng sửa tiêu đề để đổi ID");
        return prev;
      }
      return [listing, ...prev];
    });
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast.success("Đã xoá bài đăng");
  };

  return (
    <div className="container px-4 py-4 mx-auto">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ListingForm onSubmit={handleAdd} />
        </div>
        {/* <div className="lg:col-span-8">
          <h5 className="mb-3 text-lg font-medium">Bài đăng của tôi</h5>
          <Gallery items={items} onRemove={handleRemove} />
        </div> */}
      </div>
    </div>
  );
}
