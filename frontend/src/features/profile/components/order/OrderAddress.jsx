export default function OrderAddress({ toContact }) {
  return (
    <div>
      <p className="font-semibold text-gray-900 mb-1">
        {toContact.name || "Người nhận"}
      </p>
      <p className="text-sm text-gray-600 mb-1">{toContact.phone || "(chưa có SĐT)"}</p>
      <p className="text-sm text-gray-600 leading-relaxed">
        {toContact.detail}, {toContact.ward_name}, {toContact.district_name},{" "}
        {toContact.province_name}
      </p>
    </div>
  )
}
