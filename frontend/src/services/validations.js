// src/services/validations.js

// ===== Helpers =====
export const bytesToMB = (bytes) => bytes / (1024 * 1024);
const res = (ok, message = "") => ({ ok, message });

// ===== Images =====
// - Tối đa 8 ảnh
// - Mỗi ảnh ≤ 10 MB
// - Chỉ image/*
export function validateImages({
  currentCount = 0,
  newFiles = [],
  maxCount = 8,
  maxSizeMB = 10,
}) {
  const invalidType = newFiles.find((f) => !f.type?.startsWith("image/"));
  if (invalidType) return res(false, "Chỉ chấp nhận định dạng ảnh (image/*).");

  if (currentCount + newFiles.length > maxCount) {
    return res(false, `Bạn chỉ có thể đăng tối đa ${maxCount} ảnh.`);
  }

  const oversize = newFiles.find((f) => bytesToMB(f.size) > maxSizeMB);
  if (oversize) return res(false, `Mỗi ảnh không vượt quá ${maxSizeMB}MB.`);

  return res(true);
}

// ===== Videos =====
// - Tối đa 1 video
// - ≤ 30 MB
// - Chỉ video/*
export function validateVideos({
  currentCount = 0,
  newFiles = [],
  maxCount = 1,
  maxSizeMB = 30,
}) {
  const invalidType = newFiles.find((f) => !f.type?.startsWith("video/"));
  if (invalidType)
    return res(false, "Chỉ chấp nhận định dạng video (video/*).");

  if (currentCount + newFiles.length > maxCount) {
    return res(false, `Bạn chỉ có thể đăng tối đa ${maxCount} video.`);
  }

  const oversize = newFiles.find((f) => bytesToMB(f.size) > maxSizeMB);
  if (oversize) return res(false, `Mỗi video không vượt quá ${maxSizeMB}MB.`);

  return res(true);
}

// ===== Common post fields (title, price, etc.) =====
export function validatePostFields({ title, price }) {
  if (!String(title || "").trim()) return res(false, "Vui lòng nhập tiêu đề!");
  const n = Number(String(price).replaceAll(/[,_]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return res(false, "Giá phải là số > 0");
  return res(true);
}

// Regex SĐT VN (bạn đang dùng)
export const VN_PHONE_REGEX =
  /^(0)(3[2-9]|5[25689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]).{6,}$/;

export function validateForgetPassword({ password, confirmPassword }) {
  const errors = {};
  // password
  if (!password || password.trim() === "") {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần ít nhất 6 ký tự";
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      "Mật khẩu cần ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
  }

  // confirmPassword
  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return errors;
}

export function validateRegister(form = {}) {
  const errors = {};
  const password = String(form.password ?? "");
  const confirmPassword = String(form.confirmPassword ?? "");
  // display_name
  if (!form.display_name?.trim()) {
    errors.display_name = "Vui lòng nhập họ tên";
  } else if (form.display_name.trim().length < 3) {
    errors.display_name = "Tên quá ngắn, vui lòng nhập đầy đủ họ tên";
  }
  // phone
  if (!form.phone?.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!VN_PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ";
  }
  // password
  if (!password || password.trim() === "") {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần ít nhất 6 ký tự";
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      "Mật khẩu cần ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
  }
  // confirmPassword
  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return errors;
}

export function validateLogin({ phone, password }) {
  const errors = {};
  if (!phone || phone.trim() === "") {
    errors.phone = "Vui lòng nhập số điện thoại ";
  } else if (!VN_PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ";
  }
  if (!password || password.trim() === "") {
    errors.password = "Vui lòng nhập mật khẩu";
  }
  return errors;
}

// ===== Post Form Validations =====

/**
 * Validate user package before posting
 */
export function validateUserPackage(user) {
  if (!user?.package_id || user.package_id === null) {
    return res(false, "Bạn phải đăng ký gói trước khi đăng tin");
  }
  return res(true);
}

/**
 * Validate basic post information
 */
export function validatePostBasicInfo({ title, price, imagePreviews = [] }) {
  if (!title?.trim()) {
    return res(false, "Vui lòng nhập tiêu đề bài đăng");
  }
  if (!price || Number(price) <= 0) {
    return res(false, "Vui lòng nhập giá hợp lệ");
  }
  if (imagePreviews.length === 0) {
    return res(false, "Vui lòng thêm ít nhất 1 ảnh");
  }
  return res(true);
}

/**
 * Validate category specific requirements
 */
export function validateCategoryRequirements({
  categoryId,
  sellerContactId,
  requireBase,
  baseId,
}) {
  if (categoryId === 2 && !sellerContactId) {
    return res(false, "Vui lòng chọn liên hệ người bán");
  }
  if (requireBase && !baseId) {
    return res(false, "Vui lòng chọn cơ sở kiểm định");
  }
  return res(true);
}

/**
 * Validate required variations
 */
export function validateRequiredVariations({
  visibleVarIds,
  selectedByVar,
  vg,
}) {
  const requiredVarIds = visibleVarIds.filter((varId) => {
    const meta = vg.metaByVariationId?.get(varId);
    return meta?.is_require === true;
  });

  for (const varId of requiredVarIds) {
    const value = selectedByVar[varId];
    const label = vg.titlesByVariationId.get(varId);
    if (!value || String(value).trim().length === 0) {
      return res(false, `Vui lòng nhập ${label}`);
    }
  }

  return res(true);
}

/**
 * Main validation for post form submission
 */
export function validatePostFormSubmission({
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
}) {
  // 1. Check user package
  const packageCheck = validateUserPackage(user);
  if (!packageCheck.ok) return packageCheck;

  // 2. Check basic info
  const basicCheck = validatePostBasicInfo({ title, price, imagePreviews });
  if (!basicCheck.ok) return basicCheck;

  // 3. Check category requirements
  const categoryCheck = validateCategoryRequirements({
    categoryId,
    sellerContactId,
    requireBase,
    baseId,
  });
  if (!categoryCheck.ok) return categoryCheck;

  // 4. Check required variations
  const variationCheck = validateRequiredVariations({
    visibleVarIds,
    selectedByVar,
    vg,
  });
  if (!variationCheck.ok) return variationCheck;

  return res(true);
}
