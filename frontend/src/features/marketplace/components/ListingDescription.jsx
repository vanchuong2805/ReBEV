import { FileText, Info } from "lucide-react";

export default function ListingDescription({ listing, variations = [], variationValuesId = [] }) {
  return (
    <div className="space-y-8 font-sans text-[15px]">
      {/* === MÔ TẢ SẢN PHẨM === */}
      <section className="bg-white rounded-l shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-2 px-6 py-4 bg-gray-100 border-b border-gray-200">
          <FileText className="w-5 h-5 text-gray-700" />
          <h2 className="text-[16px] font-semibold text-gray-900 uppercase tracking-wide">
            Mô tả sản phẩm
          </h2>
        </header>

        {/* Content */}
        <article className="p-6 leading-relaxed text-gray-700">
          <div
            className="prose prose-slate prose-sm max-w-none text-gray-800
                        prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5"
            dangerouslySetInnerHTML={{ __html: listing.description }}
          />
        </article>
      </section>

      {/* === THÔNG SỐ KỸ THUẬT === */}
      {listing.post_details?.length > 0 && (
        <section className="bg-white rounded-l shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-gray-200 border-b border-gray-300">
            <h2 className="text-[16px] font-bold text-gray-900 uppercase tracking-wide">
              Thông số kỹ thuật
            </h2>
          </header>

          {/* Table-style layout */}
          <div className="divide-y divide-gray-100">
            {listing.post_details.map((detail, idx) => {
              const v = variations.find((vv) => vv.id === detail.variation_id);
              const varVal = variationValuesId.find(
                (vv) => vv.id === detail.variation_value_id
              );
              const displayValue =
                detail.custom_value !== "null"
                  ? detail.custom_value
                  : varVal?.value || "—";

              return (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-4 px-6 py-3 hover:bg-gray-50 transition"
                >
                  <div className="text-gray-800 font-medium">{v?.name}</div>
                  <div className="text-gray-900">{displayValue}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
