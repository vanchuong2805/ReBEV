import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";

export default function GroupCart({ groupItems }) {
  const { toggleGroupSelection, isGroupSelected } = useCart();
  console.log("GroupCart rendered:", groupItems);
  const { detail, ward_name, district_name, province_name } =
    groupItems.seller_contact || {};
  return (
    <>
      <div key={groupItems.seller_id} className="p-4 mb-8 border rounded-lg">
        <input
          type="checkbox"
          className="w-5 h-5 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={isGroupSelected({
            seller_id: groupItems.seller_id,
            seller_contact_id: groupItems.seller_contact.id,
          })}
          onChange={() =>
            toggleGroupSelection({
              seller_id: groupItems.seller_id,
              seller_contact_id: groupItems.seller_contact.id,
            })
          }
        />
        <span>
          {groupItems.seller_display_name} |{" "}
          {`${detail}, ${ward_name}, ${district_name}, ${province_name}`}
        </span>
        {groupItems.items.map((post) => (
          <CartItem key={crypto.randomUUID()} item={post} />
        ))}
      </div>
    </>
  );
}
