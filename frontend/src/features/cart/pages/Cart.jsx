import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

export default function Cart() {
  const { items, update, remove, clear, total } = useCart();

  if (!items.length)
    return (
      <div className="container p-6 mx-auto text-center">
        <p className="text-gray-500">Giỏ hàng trống</p>
        <Link to="/marketplace" className="text-blue-600 underline">
          Tiếp tục mua sắm
        </Link>
      </div>
    );

  return (
    <div className="container p-6 mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Giỏ hàng</h1>
      <div className="bg-white divide-y rounded-lg shadow-sm">
        {items.map((it) => (
          <CartItem
            key={it.id}
            item={it}
            onQtyChange={update}
            onRemove={remove}
          />
        ))}
      </div>
      <CartSummary total={total} onClear={clear} />
    </div>
  );
}
