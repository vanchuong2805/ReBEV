// src/services/validations.js
import * as Yup from "yup";

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
// ===== Yup Validation Schemas =====

/**
 * Post Form Schema
 */
export const createPostSchema = ({ categoryId, requireBase }) =>
  Yup.object({
    title: Yup.string()
      .required("Vui lòng nhập tiêu đề bài đăng")
      .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
      .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
    price: Yup.string().required("Vui lòng nhập giá bán"),
    description: Yup.string()
      .max(5000, "Mô tả không được vượt quá 5000 ký tự")
      .required("Vui lòng nhập mô tả")
      .min(10, "Mô tả phải có ít nhất 10 ký tự"),
    sellerContactId:
      categoryId === 2
        ? Yup.string().required("Vui lòng chọn thông tin liên hệ người bán")
        : Yup.string(),
    baseId: requireBase
      ? Yup.string().required("Vui lòng chọn cơ sở kiểm định")
      : Yup.string(),
  });

/**
 * Withdraw Form Schema
 */
export const withdrawSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Vui lòng nhập số tiền.")
    .min(50000, "Số tiền tối thiểu là 50.000₫."),

  method: Yup.string().oneOf(["momo", "bank"]).required(""),

  momoPhone: Yup.string().when("method", {
    is: "momo",
    then: (schema) =>
      schema
        .required("Vui lòng nhập số điện thoại MoMo.")
        .matches(/^[0-9]{10}$/, "Số điện thoại phải gồm đúng 10 chữ số."),
  }),

  momoName: Yup.string().when("method", {
    is: "momo",
    then: (schema) =>
      schema
        .required("Vui lòng nhập tên chủ tài khoản MoMo.")
        .test(
          "has-two-words",
          "Tên phải gồm ít nhất 2 từ.",
          (value) => value && value.trim().split(" ").length >= 2
        ),
  }),

  bankName: Yup.string().when("method", {
    is: "bank",
    then: (schema) => schema.required("Vui lòng chọn ngân hàng."),
  }),

  bankNumber: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema
        .required("Vui lòng nhập số tài khoản.")
        .matches(/^[0-9]{8,16}$/, "Số tài khoản không hợp lệ."),
  }),

  bankOwner: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema
        .required("Vui lòng nhập tên chủ tài khoản.")
        .test(
          "has-two-words",
          "Tên phải gồm ít nhất 2 từ.",
          (value) => value && value.trim().split(" ").length >= 2
        ),
  }),
});

/**
 * Address Form Schema
 */
export const addressSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập họ và tên."),
  phone: Yup.string()
    .matches(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ.")
    .required("Vui lòng nhập số điện thoại."),
  detail: Yup.string().required("Vui lòng nhập địa chỉ chi tiết."),
  province_id: Yup.string().required("Vui lòng chọn Tỉnh/Thành phố."),
  district_id: Yup.string().required("Vui lòng chọn Quận/Huyện."),
  ward_name: Yup.string().required("Vui lòng chọn Phường/Xã."),
});

/**
 * Forget Password Schema
 */
export const forgetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu cần ít nhất 6 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]).{6,}$/,
      "Mật khẩu cần ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt"
    ),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

/**
 * Register Schema
 */
export const registerSchema = Yup.object({
  display_name: Yup.string()
    .required("Vui lòng nhập họ tên")
    .min(3, "Tên quá ngắn, vui lòng nhập đầy đủ họ tên"),
  phone: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^(0)(3[2-9]|5[25689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu cần ít nhất 6 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]).{6,}$/,
      "Mật khẩu cần ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt"
    ),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

/**
 * Login Schema
 */
export const loginSchema = Yup.object({
  phone: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^(0)(3[2-9]|5[25689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

/**
 * Forgot Phone Schema
 */
export const forgotPhoneSchema = Yup.object({
  phone: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^(0)(3[2-9]|5[25689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
});

/**
 * OTP Schema
 */
export const otpSchema = Yup.object({
  otp: Yup.string()
    .required("Vui lòng nhập mã OTP")
    .matches(/^[0-9]{6}$/, "Mã OTP phải gồm 6 chữ số"),
});
