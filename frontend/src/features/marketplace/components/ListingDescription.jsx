import { FileText } from "lucide-react"

export default function ListingDescription({ listing, variations=[], variationValuesId=[] }) {
  return (
    <div className="space-y-8 font-sans text-[15px]">
      {/* === MÔ TẢ CHI TIẾT === */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-[17px] font-semibold text-gray-900">Mô tả chi tiết</h2>
        </div>

        <div className="p-6 leading-relaxed text-gray-700 text-[15px] tracking-wide">
          <div
            className="prose prose-slate prose-sm max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: listing.description }}
          />
        </div>
      </div>

      {/* === THÔNG SỐ KỸ THUẬT === */}
      {listing.post_details?.length > 0 && (
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-[17px] font-semibold text-gray-900 tracking-wide uppercase">
              Thông số kỹ thuật
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {listing.post_details.map((detail, idx) => {
              const v = variations?.find((vv) => vv.id === detail.variation_id)
              const varVal = variationValuesId?.find((vv) => vv.id === detail.variation_value_id)
              const displayValue =
                detail.custom_value !== "null" ? detail.custom_value : varVal?.value || "—"

              return (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-4 px-6 py-3 hover:bg-gray-50 transition-colors duration-150"
                >
                  <p className="text-gray-500 font-medium">{v?.name}</p>
                  <p className="text-gray-900 font-semibold">{displayValue}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
