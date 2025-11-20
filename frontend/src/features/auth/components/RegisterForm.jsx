import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { googleLogin, registerUser } from "../service";
import FieldError from "./FieldError";
import { registerSchema } from "../../../services/validations";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../../contexts/UserContext";
import { redirectAfterLogin } from "../../../services/routeGuard";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      display_name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = { ...values };
        delete payload.confirmPassword; // BE xóa trường này
        const response = await registerUser(payload);
        console.log("User registered successfully:", response);
        toast.success("Đăng ký thành công!", {
          description: "Chào mừng bạn đến với ReBev",
          duration: 3000,
        });
        resetForm();
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error("Số điện thoại đã được sử dụng!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response; // Google ID Token
      const data = await googleLogin(credential); // gọi API tới backend

      // nếu BE trả về user + accessToken
      login(data.user, data.accessToken);

      toast.success("Đăng nhập Google thành công!");

      // Redirect dựa trên role
      redirectAfterLogin(data.user, navigate);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md p-8 bg-transparent rounded-none shadow-none"
      >
        <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">
          Đăng Ký Tài Khoản
        </h2>

        {/* TÊN */}
        <div className="relative mb-8">
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formik.values.display_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.display_name && formik.errors.display_name
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Nhập tên của bạn"
          />
          <FieldError
            message={formik.touched.display_name && formik.errors.display_name}
          />
        </div>

        {/* SĐT */}
        <div className="relative mb-8">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Nhập số điện thoại"
          />
          <FieldError message={formik.touched.phone && formik.errors.phone} />
        </div>

        {/* MẬT KHẨU */}
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Nhập mật khẩu"
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

        {/* XÁC NHẬN */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Xác nhận lại mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 flex items-center text-gray-500 right-3 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <FieldError
            message={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-2 mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {formik.isSubmitting ? "Đang đăng ký..." : "Đăng Ký"}
        </button>

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
      </form>
    </div>
  );
};

export default RegisterForm;
