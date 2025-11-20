// features/auth/pages/ForgotPhonePage.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getOTP } from "../service";
import { toast } from "sonner";
import { forgotPhoneSchema } from "@/services/validations";
import FieldError from "../components/FieldError";

export default function ForgotPhonePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  const formik = useFormik({
    initialValues: {
      phone: state?.phone || sessionStorage.getItem("fp_phone") || "",
    },
    validationSchema: forgotPhoneSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = await getOTP(values.phone);
        const otp = String(data?.otp ?? "");
        sessionStorage.setItem("fp_phone", values.phone);
        sessionStorage.setItem("fp_otp", otp);
        toast.success(`Mã OTP của bạn là: ${otp}`, { duration: 10000 });
        nav("/forgot/otp");
      } catch (e) {
        console.error(e);
        if (e.response.status === 404) {
          toast.error("Số điện thoại chưa được đăng ký");
        } else if (e.response.status === 500) {
          toast.error("Máy chủ gặp sự cố, vui lòng thử lại sau");
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.phone)
      sessionStorage.setItem("fp_phone", formik.values.phone);
  }, [formik.values.phone]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="p-8 bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h1>
            <p className="mt-2 text-sm text-gray-600">
              Nhập số điện thoại để nhận mã OTP
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-9">
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onChange={(e) =>
                    formik.setFieldValue("phone", e.target.value.trim())
                  }
                  onBlur={formik.handleBlur}
                  placeholder="Nhập số điện thoại của bạn"
                  className="block w-full py-3 pl-10 pr-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoComplete="tel"
                />
              </div>
              <FieldError
                message={formik.touched.phone && formik.errors.phone}
              />
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.values.phone}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <>
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang gửi OTP...
                </>
              ) : (
                "Gửi mã OTP"
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => nav("/")}
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
