// features/auth/pages/OtpPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { otpSchema } from "@/services/validations";
import { toast } from "sonner";
import { getOTP } from "../service";
import FieldError from "../components/FieldError";

export default function OtpPage() {
  const nav = useNavigate();
  const phone = sessionStorage.getItem("fp_phone") || "";
  const otpServer = sessionStorage.getItem("fp_otp") || "";
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!phone || !otpServer) nav("/forgot");
  }, [phone, otpServer, nav]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    try {
      const data = await getOTP(phone);
      const otp = String(data?.otp ?? "");
      sessionStorage.setItem("fp_otp", otp);
      toast.success(`Mã OTP mới đã được gửi: ${otp}`, { duration: 10000 });
      setResendCooldown(20);
    } catch (e) {
      console.error(e);
      toast.error("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      if (values.otp === otpServer) {
        sessionStorage.setItem("fp_verified", "1");
        nav("/forgot/new");
      } else {
        toast.error("Mã OTP không đúng. Vui lòng thử lại.");
      }
    },
  });

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
            <h1 className="text-2xl font-bold text-gray-900">Xác thực OTP</h1>
            <p className="mt-2 text-sm text-gray-600">
              Mã OTP đã được gửi đến số điện thoại{" "}
              <span className="font-semibold text-gray-900">{phone}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block mb-2 text-sm font-medium text-center text-gray-700"
              >
                Nhập mã OTP (6 chữ số)
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={formik.values.otp}
                onChange={(e) =>
                  formik.setFieldValue("otp", e.target.value.replace(/\D/g, ""))
                }
                onBlur={formik.handleBlur}
                placeholder="------"
                className="block w-full px-4 py-4 text-2xl tracking-[0.5em] text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                autoComplete="one-time-code"
                autoFocus
              />
              <FieldError message={formik.touched.otp && formik.errors.otp} />
            </div>

            <button
              type="submit"
              disabled={formik.values.otp.length !== 6 || formik.isSubmitting}
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Đang xác nhận..." : "Xác nhận OTP"}
            </button>
          </form>

          {/* Resend Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Gửi lại sau ${resendCooldown}s`
                : "Gửi lại mã OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
