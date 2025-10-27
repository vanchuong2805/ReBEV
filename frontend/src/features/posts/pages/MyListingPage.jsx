import React, { useState } from "react";
import { Link } from "react-router";
import ListingForm from "../components/ListingForm.jsx";

export default function MyListingPage() {
  const [items, setItems] = useState([]);

  const handleAdd = (listing) => {
    setItems((prev) => [listing, ...prev]);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-3xl mx-auto">
        {/* 2.Nút "Back" ở đây */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay về trang chủ
          </Link>
        </div>

        <ListingForm onSubmit={handleAdd} />
      </div>
    </div>
  );
}
