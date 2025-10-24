import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpload } from "./useUpload";
import {
  validateImages,
  validateVideos,
  validatePostFields,
} from "@/services/validations";
import { createPost } from "@/features/posts/service";

export function usePostForm({ categoryId, requireBase, onSubmit }) {
  const { upload } = useUpload();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const check = validateImages({
      currentCount: imageFiles.length,
      newFiles: files,
      maxCount: 8,
      maxSizeMB: 10,
    });
    if (!check.ok) return toast.error(check.message);
    setImageFiles((p) => [...p, ...files]);
    setImagePreviews((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);
    const check = validateVideos({
      currentCount: videoFiles.length,
      newFiles: files,
      maxCount: 1,
      maxSizeMB: 30,
    });
    if (!check.ok) return toast.error(check.message);
    setVideoFiles((p) => [...p, ...files]);
    setVideoPreviews((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleRemoveImage = (idx) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImageFiles((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleRemoveVideo = (idx) => {
    URL.revokeObjectURL(videoPreviews[idx]);
    setVideoFiles((p) => p.filter((_, i) => i !== idx));
    setVideoPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    videoPreviews.forEach((u) => URL.revokeObjectURL(u));
    setImageFiles([]);
    setVideoFiles([]);
    setImagePreviews([]);
    setVideoPreviews([]);
    fileInputRef.current && (fileInputRef.current.value = "");
    videoInputRef.current && (videoInputRef.current.value = "");
  };

  async function submitCore({
    title,
    price,
    description,
    baseId,
    details,
    coverImageIndex,
  }) {
    const fieldsCheck = validatePostFields({ title, price });
    if (!fieldsCheck.ok) return toast.error(fieldsCheck.message);
    if (imageFiles.length === 0)
      return toast.error("Vui lòng thêm ít nhất 1 ảnh!");

    toast.loading("Đang tải ảnh/video lên Cloudinary...");

    //toast.error("Không tải ảnh/video lên Cloudinary");
    try {
      const uploads = await Promise.all([
        ...imageFiles.map(upload),
        ...videoFiles.map(upload),
      ]);

      // Ảnh nằm trước, video nằm sau trong 'uploads' — dùng bộ đếm cho ảnh
      const imgCount = imageFiles.length;
      const chosenImgIdx =
        Number.isInteger(coverImageIndex) &&
        coverImageIndex >= 0 &&
        coverImageIndex < imgCount
          ? coverImageIndex
          : 0;
      let imgIdx = 0;
      const mediaFiles = uploads.map((u) => {
        const isImg = u.type === "image";
        const isThumb = isImg && imgIdx === chosenImgIdx;
        if (isImg) imgIdx += 1;
        return { url: u.url, is_thumbnail: isThumb };
      });

      const payload = {
        category_id: categoryId,
        title: title.trim(),
        seller_contact_id: categoryId === 2 ? userId : null,
        price: Number(String(price).replaceAll(/[,_]/g, "")),
        description: String(description || "").trim(),
        base_id: requireBase ? baseId || null : null,
        details,
        mediaFiles,
      };

      const data = await createPost({ payload });
      toast.success("Đăng tin thành công!");
      onSubmit?.(data);
      handleReset();
      return data;
    } catch (err) {
      toast.error(err?.message || "Đăng tin thất bại");
      throw err;
    } finally {
      toast.dismiss();
    }
  }

  return {
    imageFiles,
    videoFiles,
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
  };
}
