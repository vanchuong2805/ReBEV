import { useCart } from "@/contexts/CartContext";
import { MapPin, Store } from "lucide-react";
import CartItem from "./CartItem";

export default function GroupCart({ groupItems }) {
  const { toggleGroupSelection, isGroupSelected } = useCart();
  console.log("GroupCart rendered:", groupItems);
  const { detail, ward_name, district_name, province_name } =
    groupItems.seller_contact || {};

  const isSelected = isGroupSelected({
    seller_id: groupItems.seller_id,
    seller_contact_id: groupItems.seller_contact.id,
  });

  return (
    <div className="mb-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-lg">
      {/* Seller Header */}
      <div
        className={`p-5 border-b transition-colors ${
          isSelected
            ? "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 transition-all border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-blue-400"
              checked={isSelected}
              onChange={() =>
                toggleGroupSelection({
                  seller_id: groupItems.seller_id,
                  seller_contact_id: groupItems.seller_contact.id,
                })
              }
            />
          </div>

          {/* Seller Info */}
          <div className="flex-1 min-w-0">
            {/* Seller Name */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Store className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {groupItems.seller_display_name}
              </h3>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {`${detail}, ${ward_name}, ${district_name}, ${province_name}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-0">
        {groupItems.items.map((post) => (
          <CartItem key={post.post_id} item={post} />
        ))}
      </div>
    </div>
  );
}
