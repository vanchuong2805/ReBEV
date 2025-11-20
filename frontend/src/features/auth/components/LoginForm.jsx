// LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import FieldError from "./FieldError";
import { loginSchema } from "../../../services/validations";
import { googleLogin, loginUser } from "../service";
import { useUser } from "../../../contexts/UserContext";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { redirectAfterLogin } from "../../../services/routeGuard";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await loginUser(values);
        login(response.user, response.accessToken);
        toast.success("Đăng nhập thành công!");
        redirectAfterLogin(response.user, navigate);
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Đăng nhập thất bại!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response;
      const data = await googleLogin(credential);
      login(data.user, data.token);
      toast.success("Đăng nhập Google thành công!");
      // Redirect dựa trên role
      redirectAfterLogin(data.user, navigate);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto bg-transparent border-0 rounded-none shadow-none">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Đăng nhập</h2>
        <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="relative mb-8">
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Nhập số điện thoại"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          <FieldError message={formik.touched.phone && formik.errors.phone} />
        </div>

        <div className="relative mb-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Nhập mật khẩu"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 flex items-center text-gray-500 right-3 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <FieldError
            message={formik.touched.password && formik.errors.password}
          />
        </div>

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => {
              // lưu số điện thoại để trang Forgot đọc được
              // dùng sessionStorage cho chắc (tránh mất khi reload)
              sessionStorage.setItem("fp_phone", formik.values.phone || "");
              window.open("/forgot", "_blank");
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {formik.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      {/* social */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Đăng nhập Google thất bại!")}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
