import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVariationValues, basesService } from "@/features/posts/service";
import { useVariationGraph } from "@/hooks/posts/useVariations";
import { usePostForm } from "@/hooks/posts/usePostForm";
import { toast } from "sonner";
import { getContactByUserId } from "@/features/profile/service";
import { validatePostFormSubmission } from "@/services/validations";
import { buildPostDetails } from "../utils";
import MediaPicker from "./MediaPicker";
import VariationsSection from "./VariationsSection";
import BaseField from "./BaseField";
import SellerContactField from "./SellerContactField";
import DescriptionField from "./DescriptionField";
import ActionBar from "./ActionBar";
import SuccessModal from "./SuccessModal";

export default function Form({
  categoryId = 1,
  onSubmit,
  requireBase = false,
}) {
  const navigate = useNavigate();

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

  // submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePriceChange = (e) => {
    let raw = e.target.value.replace(/\D/g, ""); // bỏ dấu và chữ

    if (!raw) {
      setPrice("");
      return;
    }

    let formatted = Number(raw).toLocaleString("vi-VN");
    setPrice(formatted);
  };

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

    // Validate form using centralized validation
    const validation = validatePostFormSubmission({
      user,
      title,
      price,
      imagePreviews,
      categoryId,
      sellerContactId,
      requireBase,
      baseId,
      visibleVarIds,
      selectedByVar,
      vg,
    });

    if (!validation.ok) {
      return toast.error(validation.message);
    }

    setIsSubmitting(true);

    try {
      const details = buildPostDetails(selectedByVar, vg);

      await submitCore({
        title,
        price,
        description,
        baseId,
        details,
        coverImageIndex,
        sellerContactId,
      });

      // Reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setSelectedByVar({});
      setBaseId("");
      setCoverImageIndex(0);
      setSellerContactId("");

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error?.message || "Đăng tin thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  }

  // chỉ render variations có tiêu đề hợp lệ (đúng category)
  const visibleVarIds = useMemo(() => {
    const ids = vg.definitionIds?.length
      ? vg.definitionIds
      : vg.orderedVariationIds;
    return ids.filter((id) => vg.titlesByVariationId.has(id));
  }, [vg.definitionIds, vg.orderedVariationIds, vg.titlesByVariationId]);

  const handleResetForm = () => {
    handleReset();
    setTitle("");
    setPrice("");
    setDescription("");
    setSelectedByVar({});
    setBaseId("");
    setCoverImageIndex(0);
    setSellerContactId("");
  };

  // Modal handlers
  const handlePostAgain = () => {
    setShowSuccessModal(false);
    // Form đã được reset trong handleSubmit
  };

  const handleViewListings = () => {
    setShowSuccessModal(false);
    navigate("/profile/listings");
  };

  const handleCoverImageChange = (index) => {
    setCoverImageIndex(index);
  };

  const handleRemoveImageWithCover = (index) => {
    const wasCover = index === coverImageIndex;
    handleRemoveImage(index);
    if (wasCover) {
      const nextLen = imagePreviews.length - 1;
      setCoverImageIndex(nextLen > 0 ? 0 : 0);
    } else if (index < coverImageIndex) {
      setCoverImageIndex((c) => Math.max(0, c - 1));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-6 border-t">
      {loadingVars && (
        <div className="mb-3 text-sm text-gray-500">Đang tải danh mục…</div>
      )}
      {varsError && (
        <div className="mb-3 text-sm text-red-600">{varsError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        {/* MEDIA */}
        <MediaPicker
          imagePreviews={imagePreviews}
          videoPreviews={videoPreviews}
          coverImageIndex={coverImageIndex}
          onCoverImageChange={handleCoverImageChange}
          fileInputRef={fileInputRef}
          videoInputRef={videoInputRef}
          onImageChange={handleImageChange}
          onVideoChange={handleVideoChange}
          onRemoveImage={handleRemoveImageWithCover}
          onRemoveVideo={handleRemoveVideo}
        />
        {/* FIELDS */}
        <div className="space-y-4 md:col-span-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tiêu đề bài đăng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài đăng"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              placeholder="Nhập giá bán (VND)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Variations */}
          <VariationsSection
            visibleVarIds={visibleVarIds}
            vg={vg}
            selectedByVar={selectedByVar}
            onUpdateSelection={updateSelection}
          />

          {/* Seller Contact - CHỈ CHO CATEGORY 2 */}
          {categoryId === 2 && (
            <SellerContactField
              contacts={contacts}
              sellerContactId={sellerContactId}
              onContactChange={setSellerContactId}
            />
          )}

          {/* Base Field - Cơ sở kiểm định */}
          {requireBase && (
            <BaseField bases={bases} baseId={baseId} onBaseChange={setBaseId} />
          )}

          {/* Description */}
          <DescriptionField
            description={description}
            onDescriptionChange={setDescription}
          />
        </div>
      </div>

      {/* Warning nếu không có package */}
      {(!user?.package_id || user.package_id === null) && (
        <div className="p-4 mt-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
          Bạn cần đăng ký gói trước khi có thể đăng tin
        </div>
      )}

      <ActionBar
        onReset={handleResetForm}
        isSubmitting={isSubmitting}
        disabled={!user?.package_id || user.package_id === null}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onPostAgain={handlePostAgain}
        onViewListings={handleViewListings}
      />
    </form>
  );
}
