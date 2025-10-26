import { useSearchParams, Link } from "react-router";

export default function PaymentSuccess() {
  const [sp] = useSearchParams();
  const orderId = sp.get("orderId");
  const total = Number(sp.get("total") || 0);

  return (
    <div className="container p-6 mx-auto text-center">
      <h1 className="text-2xl font-semibold text-green-600">
        Đặt hàng thành công
      </h1>
      <p className="mt-2 text-gray-600">
        Mã đơn: <span className="font-mono">{orderId}</span>
      </p>
      <p className="mt-1 text-gray-600">
        Tổng tiền:{" "}
        <span className="font-semibold">{total.toLocaleString("vi-VN")}₫</span>
      </p>
      <div className="mt-6 space-x-3">
        <Link to="/marketplace" className="text-blue-600 underline">
          Tiếp tục mua sắm
        </Link>
        <Link to="/cart" className="text-gray-600 underline">
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
}
