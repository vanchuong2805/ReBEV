export default function OrderAddress({ toContact, fromContact,type }) {
  return (
    <div className="space-y-5">

      {/* Nếu có fromContact → hiện Địa điểm xem xe */}
      {fromContact && (
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
            {type===2 ? "Địa điểm giao dịch" : "Địa chỉ người bán"}
          </p>

          <p className="font-semibold text-gray-900 mb-1">
            {fromContact.name || "Không có tên"}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            {fromContact.phone || "(chưa có SĐT)"}
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            {[fromContact.detail, fromContact.ward_name, fromContact.district_name, fromContact.province_name]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      {/* Nếu có toContact → hiện Địa chỉ nhận hàng */}
      {toContact && (
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
            Địa chỉ nhận hàng
          </p>

          <p className="font-semibold text-gray-900 mb-1">
            {toContact.name || "Không có tên"}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            {toContact.phone || "(chưa có SĐT)"}
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            {[toContact.detail, toContact.ward_name, toContact.district_name, toContact.province_name]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

    </div>
  )
}
