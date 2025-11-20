import { useCart } from "@/contexts/CartContext";
import { MapPin, Store, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="mb-4 overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
      {/* Seller Header */}
      <div
        className={`px-4 py-3 border-b transition-colors ${
          isSelected
            ? "bg-blue-50/50 border-blue-100"
            : "bg-gray-50/50 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox */}
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

          {/* Store Icon */}
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
            <Store className="w-5 h-5 text-blue-600" />
          </div>

          {/* Seller Info */}
          <div className="flex-1 min-w-0">
            {/* Seller Name - Clickable */}
            <Link
              to={`/shop/${groupItems.seller_id}`}
              className="flex items-center gap-2 group w-fit"
            >
              <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600 lg:text-lg">
                {groupItems.seller_display_name}
              </h3>
              <ChevronRight className="w-4 h-4 text-gray-400 transition-all group-hover:text-blue-600 group-hover:translate-x-1" />
            </Link>

            {/* Address */}
            <div className="flex items-start gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-600 line-clamp-1 lg:text-sm">
                {`${detail}, ${ward_name}, ${district_name}, ${province_name}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div>
        {groupItems.items.map((post) => (
          <CartItem key={post.post_id} item={post} />
        ))}
      </div>
    </div>
  );
}
