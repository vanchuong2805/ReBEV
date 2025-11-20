import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { getPostById, getVariations, getVariationValues } from "../../service";

export default function ListingDetailsModal({
  open,
  listing,
  onClose,
  onApprove,
  onReject,
}) {
  const [listingDecription, setListingDescription] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [variations, setVariations] = useState([]);
  const [variationValuesId, setVariationValuesId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostById(listing.id);
        setListingDescription(data);
      } catch (error) {
        console.error("Error fetching post by ID:", error);
      }
    };
    if (listing?.id) fetchData();
  }, [listing?.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVariationValues();
        setVariationValuesId(data);
      } catch (error) {
        console.error("Error fetching post by ID:", error);
      }
    };
    if (listing?.id) fetchData();
  }, [listing?.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVariations();
        setVariations(data);
      } catch (error) {
        console.error("Error fetching post by ID:", error);
      }
    };
    if (listing?.id) fetchData();
  }, [listing?.id]);

  const media = useMemo(() => {
    try {
      return JSON.parse(listing?.media || "[]");
    } catch {
      return [];
    }
  }, [listing?.media]);

  const imageUrls = media.map((m) => {
    // media url format in your data had extra word "image <url>"
    const parts = (m?.url || "").split(" ");
    return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
  });

  if (!open) return null;
  console.log(`listingDecription: ${JSON.stringify(listingDecription)}`);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 max-w-3xl w-full mx-4 bg-white rounded-2xl shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h3 className="text-lg font-semibold">{listing?.title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto">
          {/* Large image area */}
          <div className="lg:col-span-2">
            <div className="w-full h-[300px] bg-slate-100 flex items-center justify-center overflow-hidden rounded">
              {imageUrls.length > 0 ? (
                <img
                  src={imageUrls[activeIndex]}
                  alt={`image-${activeIndex}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-400">Không có ảnh</div>
              )}
            </div>

            {/* thumbnails */}
            {imageUrls.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {imageUrls.map((u, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-20 h-20 rounded overflow-hidden border ${
                      idx === activeIndex
                        ? "ring-2 ring-emerald-400"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={u}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description moved below images */}
            {listingDecription?.description && (
              <div
                className="mt-6 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100"
                style={{ width: "155%" }}
              >
                <h4 className="text-md font-semibold text-slate-700 mb-2">
                  Mô tả sản phẩm
                </h4>
                <div
                  className="text-sm leading-relaxed text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: listingDecription.description,
                  }}
                ></div>
              </div>
            )}

            {/* Variation details moved below description */}
            {listingDecription?.post_details &&
              listingDecription.post_details.length > 0 && (
                <div className="mb-4" style={{ width: "155%" }}>
                  <h4 className="text-md font-semibold text-slate-700 mb-2">
                    Thuộc tính sản phẩm
                  </h4>
                  <div className="divide-y divide-gray-100 rounded-lg border border-slate-100">
                    {listingDecription.post_details.map((detail, idx) => {
                      const v = variations.find(
                        (vv) => vv.id === detail.variation_id
                      );
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
                          <div className="text-gray-800 font-medium">
                            {v?.name}
                          </div>
                          <div className="text-gray-900">{displayValue}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>

          {/* Info */}
          <div className="lg:col-span-1">
            <div className="mb-3">
              <p className="text-sm text-slate-500">Người bán</p>
              <p className="font-medium">
                {listing?.user?.display_name || "Không rõ"}
              </p>
            </div>

            <div className="mb-3">
              <p className="text-sm text-slate-500">Giá</p>
              <p className="text-lg font-bold text-blue-600">
                {listing?.price?.toLocaleString?.("vi-VN") ?? listing?.price}{" "}
                VND
              </p>
            </div>

            <div className="mb-3 text-sm text-slate-500">
              <p>Tạo ngày:</p>
              <p className="text-slate-700">
                {listing?.create_at
                  ? new Date(listing.create_at).toLocaleString("vi-VN")
                  : "-"}
              </p>
            </div>

            <div className="mb-3 text-sm text-slate-500">
              <p>Liên hệ:</p>
              <p className="text-slate-700">{listing?.user?.phone || "-"}</p>
              <p className="text-slate-700">{listing?.user?.email || "-"}</p>
            </div>
            {/* actions */}
            <div className="mt-4 flex flex-col gap-2">
              {(listing?.status === 0 || listing?.status === 2) && (
                <button
                  onClick={() => onApprove && onApprove(listing.id)}
                  className="w-full rounded-xl bg-emerald-600 text-white py-2 hover:bg-emerald-700"
                >
                  Phê duyệt
                </button>
              )}

              {(listing?.status === 0 || listing?.status === 1) && (
                <button
                  onClick={() => onReject && onReject(listing.id)}
                  className="w-full rounded-xl border border-rose-300 text-rose-600 py-2 hover:bg-rose-50"
                >
                  Từ chối
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
