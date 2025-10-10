import { Link } from "react-router";

export default function PaymentFail() {
  return (
    <div className="container p-6 mx-auto text-center">
      <h1 className="text-2xl font-semibold text-red-600">
        Thanh toán thất bại
      </h1>
      <p className="mt-2 text-gray-600">Có lỗi xảy ra. Vui lòng thử lại sau.</p>
      <div className="mt-6 space-x-3">
        <Link to="/checkout" className="text-blue-600 underline">
          Thử lại
        </Link>
        <Link to="/marketplace" className="text-gray-600 underline">
          Quay lại mua sắm
        </Link>
      </div>
    </div>
  );
}
