import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getVariationValues, basesService } from "@/features/posts/service";
import { useVariationGraph } from "@/hooks/posts/useVariations";
import { usePostForm } from "@/hooks/posts/usePostForm";
import { toast } from "sonner";
import { getContactByUserId } from "@/features/profile/service";
import { buildPostDetails } from "../utils";
import { createPostSchema } from "@/services/validations";
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

  // contacts
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [contacts, setContacts] = useState([]);

  // variations
  const [rows, setRows] = useState([]);
  const [loadingVars, setLoadingVars] = useState(false);
  const [varsError, setVarsError] = useState("");
  const [selectedByVar, setSelectedByVar] = useState({});
  const vg = useVariationGraph(rows, categoryId);

  // bases
  const [bases, setBases] = useState([]);

  // submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // cover image index
  const [coverImageIndex, setCoverImageIndex] = useState(0);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: "",
      price: "",
      description: "",
      sellerContactId: "",
      baseId: "",
    },
    validationSchema: createPostSchema({ categoryId, requireBase }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Additional validations
        if (!user?.id) {
          toast.error("Vui lòng đăng nhập để đăng tin");
          return;
        }

        if (!user?.package_id || user.package_id === null) {
          toast.error("Bạn cần đăng ký gói trước khi có thể đăng tin");
          return;
        }

        if (imagePreviews.length === 0) {
          toast.error("Vui lòng chọn ít nhất 1 hình ảnh");
          return;
        }

        // Validate variations
        const visibleVarIds = vg.definitionIds?.length
          ? vg.definitionIds
          : vg.orderedVariationIds.filter((id) =>
              vg.titlesByVariationId.has(id)
            );

        for (const varId of visibleVarIds) {
          const parent = vg.parentOf.get(varId);
          if (parent && !selectedByVar[parent]) continue;

          if (!selectedByVar[varId]) {
            const title = vg.titlesByVariationId.get(varId) || "Thông số";
            toast.error(`Vui lòng chọn ${title}`);
            return;
          }
        }

        setIsSubmitting(true);

        const details = buildPostDetails(selectedByVar, vg);

        // Remove formatting from price
        const rawPrice = values.price.replace(/\D/g, "");

        await submitCore({
          title: values.title,
          price: rawPrice,
          description: values.description,
          baseId: values.baseId,
          details,
          coverImageIndex,
          sellerContactId: values.sellerContactId,
        });

        // Reset form
        resetForm();
        setSelectedByVar({});
        setCoverImageIndex(0);

        // Show success modal
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(error?.message || "Đăng tin thất bại. Vui lòng thử lại!");
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  const handlePriceChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "");

    if (!raw) {
      formik.setFieldValue("price", "");
      return;
    }

    let formatted = Number(raw).toLocaleString("vi-VN");
    formik.setFieldValue("price", formatted);
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

  // chỉ render variations có tiêu đề hợp lệ (đúng category)
  const visibleVarIds = useMemo(() => {
    const ids = vg.definitionIds?.length
      ? vg.definitionIds
      : vg.orderedVariationIds;
    return ids.filter((id) => vg.titlesByVariationId.has(id));
  }, [vg.definitionIds, vg.orderedVariationIds, vg.titlesByVariationId]);

  const handleResetForm = () => {
    handleReset();
    formik.resetForm();
    setSelectedByVar({});
    setCoverImageIndex(0);
  };

  // Modal handlers
  const handlePostAgain = () => {
    setShowSuccessModal(false);
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
    <form onSubmit={formik.handleSubmit} className="pt-6 border-t">
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
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập tiêu đề bài đăng"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 form-input ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="price"
              value={formik.values.price}
              onChange={handlePriceChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập giá bán (VND)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.price && formik.errors.price
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
            )}
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
            <div>
              <SellerContactField
                contacts={contacts}
                sellerContactId={formik.values.sellerContactId}
                onContactChange={(value) =>
                  formik.setFieldValue("sellerContactId", value)
                }
              />
              {formik.touched.sellerContactId &&
                formik.errors.sellerContactId && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.sellerContactId}
                  </p>
                )}
            </div>
          )}

          {/* Base Field - Cơ sở kiểm định */}
          {requireBase && (
            <div>
              <BaseField
                bases={bases}
                baseId={formik.values.baseId}
                onBaseChange={(value) => formik.setFieldValue("baseId", value)}
              />
              {formik.touched.baseId && formik.errors.baseId && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.baseId}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <DescriptionField
              description={formik.values.description}
              onDescriptionChange={(value) =>
                formik.setFieldValue("description", value)
              }
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.description}
              </p>
            )}
          </div>
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
