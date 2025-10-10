import { Link } from "react-router";

export default function CartSummary({ total, onClear }) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onClear} className="text-gray-600 hover:underline">
        Xóa hết
      </button>
      <div className="text-right">
        <div className="text-lg font-semibold">
          {total.toLocaleString("vi-VN")}₫
        </div>
        <Link
          to="/checkout"
          className="inline-block px-4 py-2 mt-2 text-white bg-blue-600 rounded"
        >
          Thanh toán
        </Link>
      </div>
    </div>
  );
}
