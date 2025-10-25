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

export function validateRegister(form) {
  const errors = {};
  // display_name
  if (!form.display_name?.trim()) {
    errors.display_name = "Vui lòng nhập họ tên";
  } else if (form.display_name.trim().length < 3) {
    errors.display_name = "Tên quá ngắn, vui lòng nhập đầy đủ họ tên";
  }
  // phone
  if (!form.phone?.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!VN_PHONE_REGEX.test(form.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }
  // password
  if (!form.password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (form.password.length < 6) {
    errors.password = "Mật khẩu cần ít nhất 6 ký tự";
  }
  // confirmPassword
  if (!form.confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return errors;
}

export function validateLogin({ phone, password }) {
  const errors = {};
  if (!phone?.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại ";
  } else if (!VN_PHONE_REGEX.test(phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }
  if (!password?.trim()) {
    errors.password = "Vui lòng nhập mật khẩu";
  }
  return errors;
}
