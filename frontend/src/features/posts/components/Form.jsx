import React, { useCallback, useEffect, useMemo, useState } from "react";
import TiptapEditor from "@/components/common/TiptapEditor";
import { MyInput } from "./MyInput";
import {
  getVariationValues,
  basesService,  
} from "@/features/posts/service";
import { useVariationGraph } from "@/hooks/posts/useVariations";
import { usePostForm } from "@/hooks/posts/usePostForm";
import { toast } from "sonner";
import { getContactByUserId } from "@/features/profile/service";

const MAX_IMAGES = 8;
const MAX_VIDEOS = 1;

export default function Form({
  categoryId = 1,
  onSubmit,
  requireBase = false,
}) {
  const {
    imagePreviews,
    videoPreviews,
    fileInputRef,
    videoInputRef,
    handleImageChange,
    handleVideoChange,
    handleRemoveImage,
    handleRemoveVideo,
    handleReset,
    submitCore,
  } = usePostForm({ categoryId, requireBase, onSubmit });

  // local fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageIndex, setCoverImageIndex] = useState(0);

  // contacts
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [contacts, setContacts] = useState([]);
  const [sellerContactId, setSellerContactId] = useState("");

  // variations
  const [rows, setRows] = useState([]);
  const [loadingVars, setLoadingVars] = useState(false);
  const [varsError, setVarsError] = useState("");
  const [selectedByVar, setSelectedByVar] = useState({});
  const vg = useVariationGraph(rows, categoryId);

  // bases
  const [bases, setBases] = useState([]);
  const [baseId, setBaseId] = useState("");

  // chuyển input từ kg thành gram
  function parseWeightToGrams(input) {
    if (input == null) return null;
    let s = String(input).trim().toLowerCase();
    s = s.replace(/,/g, "."); // 1,5 -> 1.5

    const m = s.match(/([\d.]+)/); // bắt số
    if (!m) return null;
    const num = parseFloat(m[1]);
    if (!Number.isFinite(num)) return null;

    // mặc định coi là kg nếu không ghi đơn vị
    let unit = "kg";
    if (/\bg\b/.test(s)) unit = "g";
    if (/\bkg\b/.test(s)) unit = "kg";

    return unit === "kg" ? Math.round(num * 1000) : Math.round(num);
  }

  // Load variation values (re-fetch khi đổi categoryId)
  useEffect(() => {
    (async () => {
      try {
        setLoadingVars(true);
        const data = await getVariationValues();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setVarsError(e?.message || "Không tải được variation values");
      } finally {
        setLoadingVars(false);
      }
    })();
  }, [categoryId]);

  //load bases
  useEffect(() => {
    if (!requireBase) return;
    (async () => {
      try {
        const data = await basesService.getAllBases();
        setBases(data || []);
      } catch (err) {
        setVarsError(
          err?.message || "Không tải được danh sách cơ sở kiểm định"
        );
      }
    })();
  }, [requireBase]);

  // load contacts
  useEffect(() => {
    (async () => {
      try {
        if (!userId) return;
        const data = await getContactByUserId(userId);
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Không tải được contacts:", err);
        setContacts([]);
      }
    })();
  }, [userId]);

  //xóa các lựa chọn
  const clearDescendants = useCallback(
    (variationId, nextSel) => {
      const visited = new Set();
      function dfs(v) {
        if (visited.has(v)) return;
        visited.add(v);
        const kids = vg.childVariationsOf.get(v);
        if (!kids) return;
        for (const c of kids) {
          delete nextSel[c];
          dfs(c);
        }
      }
      dfs(variationId);
    },
    [vg.childVariationsOf]
  );

  function updateSelection(variationId, valueId) {
    setSelectedByVar((prev) => {
      const next = { ...prev, [variationId]: valueId };
      clearDescendants(variationId, next);
      return { ...next };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (categoryId === 2 && !sellerContactId) {
      return toast.error("Vui lòng chọn liên hệ người bán (seller contact)");
    }

    const details = Object.entries(selectedByVar)
      .filter(([, v]) => v != null && String(v).trim().length > 0)
      .map(([variationIdStr, raw]) => {
        const variation_id = Number(variationIdStr);
        const rawStr = String(raw).trim();

        // 1) tập option-id hợp lệ cho variation này (từ vg.byVariationId)
        const options = vg.byVariationId.get(variation_id) || [];
        const optionIdSet = new Set(options.map((o) => String(o.id)));

        // 2) meta + nhãn để nhận diện field trọng lượng
        const meta = vg.metaByVariationId?.get(variation_id);
        const isNum = !!meta?.is_number;
        const label = (
          vg.titlesByVariationId.get(variation_id) || ""
        ).toLowerCase();

        // 3) nếu người dùng chọn đúng 1 option trong list -> dùng variation_value_id
        if (optionIdSet.has(rawStr)) {
          return {
            variation_id,
            variation_value_id: Number(rawStr),
            custom_value: null,
          };
        }

        // 4) không phải option -> custom_value
        //    nếu là "Trọng lượng"  -> đổi sang gram
        const isWeight = variation_id === 13 || label.includes("trọng lượng");
        if (isWeight) {
          const grams = parseWeightToGrams(rawStr);
          return {
            variation_id,
            variation_value_id: null,
            custom_value: grams, // số gram
          };
        }

        // 5) field số khác -> cố parse số, không được thì giữ nguyên string
        if (isNum) {
          const numeric = Number(
            rawStr.replace(/[,_\s]/g, "").replace(",", ".")
          );
          return {
            variation_id,
            variation_value_id: null,
            custom_value: Number.isFinite(numeric) ? numeric : rawStr,
          };
        }

        // 6) field text
        return {
          variation_id,
          variation_value_id: null,
          custom_value: rawStr,
        };
      })
      .filter(
        (d) =>
          d.variation_value_id != null ||
          (d.custom_value !== null && String(d.custom_value).length > 0)
      );

    await submitCore({
      title,
      price,
      description,
      baseId,
      details,
      coverImageIndex,
      sellerContactId,
    });

    // reset text fields + thumbnail index
    setTitle("");
    setPrice("");
    setDescription("");
    setSelectedByVar({});
    setBaseId("");
    setCoverImageIndex(0);
    setSellerContactId("");
  }

  // chỉ render variations có tiêu đề hợp lệ (đúng category)
  const visibleVarIds = useMemo(() => {
    const ids = vg.definitionIds?.length
      ? vg.definitionIds
      : vg.orderedVariationIds;
    return ids.filter((id) => vg.titlesByVariationId.has(id));
  }, [vg.definitionIds, vg.orderedVariationIds, vg.titlesByVariationId]);

  return (
    <form onSubmit={handleSubmit} className="pt-6 border-t">
      <div className="mb-3 text-xs text-gray-500">
        Tối đa <b>{MAX_IMAGES} ảnh</b> (≤10MB/ảnh), <b>{MAX_VIDEOS} video</b>{" "}
        (≤30MB).
      </div>

      {loadingVars && (
        <div className="mb-3 text-sm text-gray-500">Đang tải danh mục…</div>
      )}
      {varsError && (
        <div className="mb-3 text-sm text-red-600">{varsError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        {/* MEDIA */}
        <div className="mb-6 space-y-3 md:mb-0 md:col-span-1">
          {/* Images */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            multiple
          />
          <div
            className="w-full overflow-hidden border-2 border-dashed rounded-lg aspect-video bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreviews.length > 0 ? (
              <img
                src={imagePreviews[coverImageIndex] || imagePreviews[0]}
                alt="Ảnh chính"
                className="object-cover w-full h-full"
              />
            ) : (
              <EmptyAdd label="Thêm ảnh" />
            )}
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <Thumb
                  key={index}
                  src={preview}
                  isCover={index === coverImageIndex}
                  onClick={() => setCoverImageIndex(index)}
                  onRemove={() => {
                    // nếu xóa ảnh đang là cover → shift cover về 0 hoặc ảnh trước đó
                    const wasCover = index === coverImageIndex;
                    handleRemoveImage(index);
                    if (wasCover) {
                      const nextLen = imagePreviews.length - 1;
                      setCoverImageIndex(nextLen > 0 ? 0 : 0);
                    } else if (index < coverImageIndex) {
                      setCoverImageIndex((c) => Math.max(0, c - 1));
                    }
                  }}
                />
              ))}
              {imagePreviews.length < MAX_IMAGES && (
                <AddSquare onClick={() => fileInputRef.current?.click()} />
              )}
            </div>
          )}

          {/* Video */}
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoChange}
            accept="video/*"
            className="hidden"
          />
          <div className="mt-3">
            <div className="mb-2 text-sm font-medium text-gray-700 ">
              Video (tuỳ chọn)
            </div>
            {videoPreviews.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {videoPreviews.map((src, i) => (
                  <VideoThumb
                    key={i}
                    src={src}
                    onRemove={() => handleRemoveVideo(i)}
                  />
                ))}
              </div>
            )}
            {videoPreviews.length < MAX_VIDEOS && (
              <AddRow
                onClick={() => videoInputRef.current?.click()}
                label="Thêm video"
              />
            )}
          </div>
        </div>

        {/* FIELDS */}
        <div className="space-y-4 md:col-span-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề bài đăng"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Giá bán (VND)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 form-input [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            onWheel={(e) => e.target.blur()}
          />

          {/* Variations */}
          <div className="grid grid-cols-1 gap-4 pt-4 border-t sm:grid-cols-2">
            {visibleVarIds.map((varId) => {
              const label = vg.titlesByVariationId.get(varId);
              if (!label) return null;

              const parentVar = vg.parentVariationOf.get(varId);
              const parentSelected = parentVar
                ? selectedByVar[parentVar]
                : null;
              const options =
                vg.filterOptionsForVariation(varId, selectedByVar) || [];

              const disabled = !!parentVar && !parentSelected;
              const parentLabel = parentVar
                ? vg.titlesByVariationId.get(parentVar) || "thuộc tính cha"
                : null;
              const placeholder = disabled
                ? `Chọn ${String(parentLabel).toLowerCase()} trước`
                : options.length === 0
                ? `Nhập ${label.toLowerCase()}`
                : `Chọn ${label.toLowerCase()}`;

              return (
                <div key={varId} className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                  <MyInput
                    options={options.map((o) => ({
                      id: o.id,
                      value: o.id,
                      label: o.value,
                    }))}
                    value={selectedByVar[varId] || ""}
                    onChange={(v) => updateSelection(varId, v)}
                    placeholder={placeholder}
                    allowFreeText={options.length === 0} // Cho phép nhập tay nếu không có option (VD: Biển số)
                    disabled={disabled}
                  />
                </div>
              );
            })}

            {/* --- Seller contact (CHỈ CHO CATEGORY 2) --- */}
            {categoryId === 2 && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Địa chỉ người bán (*)
                </span>
                <MyInput
                  options={(contacts || []).map((c) => ({
                    id: c.id,
                    value: c.id,
                    label: `${c.name} — ${c.phone} — ${c.detail}, ${c.ward_name}, ${c.district_name}, ${c.province_name}`,
                  }))}
                  value={sellerContactId || ""}
                  onChange={setSellerContactId}
                  placeholder="Chọn liên hệ người bán"
                  allowFreeText={false}
                  className="w-full"
                />
              </div>
            )}

            {requireBase && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Cơ sở kiểm định (*)
                </span>
                <MyInput
                  options={bases.map((b) => ({
                    id: b.id,
                    value: b.id,
                    label: `${b.name ?? "Cơ sở"} — ${b.detail}, ${
                      b.ward_name
                    }, ${b.district_name}, ${b.province_name}`,
                  }))}
                  value={baseId || ""}
                  onChange={setBaseId}
                  placeholder="Chọn cơ sở kiểm định"
                  allowFreeText={false}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mô tả chi tiết
            </label>
            <TiptapEditor
              style={{ whiteSpace: "pre-wrap" }}
              content={description}
              onChange={setDescription}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-6 mt-6 border-t">
        <button type="submit" className="btn-primary">
          Đăng tin
        </button>
        <button
          type="button"
          onClick={() => {
            handleReset();
            setTitle("");
            setPrice("");
            setDescription("");
            setSelectedByVar({});
            setBaseId("");
            setCoverImageIndex(0);
          }}
          className="btn-secondary"
        >
          Xoá form
        </button>
      </div>
    </form>
  );
}

/* --- small UI atoms --- */
function EmptyAdd({ label }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
}

function Thumb({ src, onRemove, onClick, isCover }) {
  return (
    <div
      className={`relative overflow-hidden rounded aspect-square cursor-pointer ${
        isCover ? "ring-2 ring-blue-500" : "ring-1 ring-transparent"
      }`}
      onClick={onClick}
      title={isCover ? "Ảnh đại diện" : "Chọn làm ảnh đại diện"}
    >
      <img src={src} alt="" className="object-cover w-full h-full" />
      {isCover && (
        <span className="absolute left-1 top-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white">
          Thumbnail
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md hover:bg-red-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

function AddSquare({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center bg-gray-100 border-2 border-dashed rounded cursor-pointer aspect-square hover:bg-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>
  );
}

function AddRow({ onClick, label }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center w-full mt-2 bg-gray-100 border-2 border-dashed rounded cursor-pointer h-31 hover:bg-gray-200"
    >
      <div className="flex items-center gap-2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

function VideoThumb({ src, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-black rounded aspect-video">
      <video src={src} controls className="object-cover w-full h-full" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md hover:bg-red-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
