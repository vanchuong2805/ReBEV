// features/auth/pages/OtpPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpPage() {
  const nav = useNavigate();
  const [otpInput, setOtpInput] = useState("");
  const phone = sessionStorage.getItem("fp_phone") || "";
  const otpServer = sessionStorage.getItem("fp_otp") || "";

  useEffect(() => {
    if (!phone || !otpServer) nav("/forgot");
  }, [phone, otpServer, nav]);

  function onSubmit(e) {
    e.preventDefault();
    if (!otpInput) return;
    if (otpInput === otpServer) {
      sessionStorage.setItem("fp_verified", "1");
      nav("/forgot/new");
    } else {
      alert("OTP không đúng.");
    }
  }

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
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block mb-2 text-sm font-medium text-center text-gray-700"
              >
                Nhập mã OTP (6 chữ số)
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="------"
                className="block w-full px-4 py-4 text-2xl tracking-[0.5em] text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={otpInput.length !== 6}
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận OTP
            </button>
          </form>

          {/* Resend Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => nav("/forgot")}
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              ← Gửi lại mã OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
