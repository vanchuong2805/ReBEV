import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "../service";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="container p-6 mx-auto text-center">
        <p className="text-gray-500">Giỏ hàng trống – không thể thanh toán</p>
        <Link to="/marketplace" className="text-blue-600 underline">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    try {
      setLoading(true);
      const res = await createOrder({ items, total });
      clear();
      navigate(`/checkout/success?orderId=${res.orderId}&total=${total}`, {
        replace: true,
      });
    } catch (e) {
      navigate("/checkout/fail", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container grid gap-6 p-6 mx-auto lg:grid-cols-3">
      {/* Left: items */}
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-xl font-semibold">Thanh toán</h1>
        <div className="bg-white divide-y rounded-lg shadow-sm">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3">
              <img
                src={it.image}
                alt={it.title}
                className="object-cover w-16 h-16 rounded bg-gray-50"
              />
              <div className="flex-1">
                <p className="font-medium line-clamp-2">{it.title}</p>
                <p className="text-sm text-gray-500">
                  {(it.price || 0).toLocaleString("vi-VN")}₫ × {it.qty}
                </p>
              </div>
              <div className="font-medium">
                {((it.price || 0) * it.qty).toLocaleString("vi-VN")}₫
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: summary */}
      <aside className="space-y-3">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span>Tạm tính</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
            <span>Phí vận chuyển</span>
            <span>—</span>
          </div>
          <hr className="my-3" />
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </aside>
    </div>
  );
}
