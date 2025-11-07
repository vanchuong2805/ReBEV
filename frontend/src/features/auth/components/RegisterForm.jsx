import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { googleLogin, registerUser } from "../service";
import FieldError from "./FieldError";
import { validateRegister } from "../../../services/validations";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../../contexts/UserContext";
import { redirectAfterLogin } from "../../../services/routeGuard";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    display_name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const newErrors = validateRegister(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      const payload = { ...formData };
      delete payload.confirmPassword; // BE xóa trường này
      const response = await registerUser(payload);
      console.log("User registered successfully:", response);
      toast.success("Đăng ký thành công!", {
        description: "Chào mừng bạn đến với ReBev",
        duration: 3000,
      });
      setFormData({
        display_name: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Số điện thoại đã được sử dụng!");
    } finally {
      setLoading(false);
    }
  };

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
        onSubmit={handleSubmit}
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
            value={formData.display_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.display_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tên của bạn"
          />
          <FieldError message={errors.display_name} />
        </div>

        {/* SĐT */}
        <div className="relative mb-8">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập số điện thoại"
          />
          <FieldError message={errors.phone} />
        </div>

        {/* MẬT KHẨU */}
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
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
          <FieldError message={errors.password} />
        </div>

        {/* XÁC NHẬN */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
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
          <FieldError message={errors.confirmPassword} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {loading ? "Đang đăng ký..." : "Đăng Ký"}
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
