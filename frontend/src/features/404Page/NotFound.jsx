import React from "react";
import { Link } from "react-router";
import NotFoundImage from "../../assets/image/404_not_found.png";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
    <img src={NotFoundImage} alt="404 Not Found" className="max-w-sm mb-8" />
    <h1 className="mb-4 text-2xl font-bold">404 - Không tìm thấy trang</h1>
    <p className="mb-6 text-gray-600">
      Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
    </p>
    <Link
      to="/"
      className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded font-bold no-underline hover:bg-blue-700 transition-colors"
    >
      Quay về trang chủ
    </Link>
  </div>
);

export default NotFound;
