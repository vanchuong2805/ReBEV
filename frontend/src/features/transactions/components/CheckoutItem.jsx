import { Trash2 } from "lucide-react";
const formatCurrency = (amount) => {
  return (amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

function CheckoutItem({ item }) {
  return (
    <div className="flex items-center p-4 border-b last:border-b-0">
      {/* Thông tin sản phẩm */}
      <div className="flex items-center flex-grow gap-4 ml-4">
        <img
          src={item.media.split(" ")[1]}
          alt={item.title}
          className="object-cover w-20 h-20 border rounded-md"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800 line-clamp-2">
            {item.title}
          </p>
          <p className="mt-1 text-gray-600 lg:hidden">
            {formatCurrency(item.price)}
          </p>
        </div>
      </div>

      {/* Các cột cho màn hình lớn */}
      <div className="items-center hidden gap-8 ml-4 lg:flex">
        <div className="w-24 font-semibold text-right text-red-500">
          {formatCurrency(item.price)}
        </div>
      </div>
    </div>
  );
}

export default CheckoutItem;
