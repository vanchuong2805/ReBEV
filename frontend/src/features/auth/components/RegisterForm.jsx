import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { registerUser } from "../service";
import FieldError from "./FieldError";
import { validateRegister } from "../../../services/validations";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    display_name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error(error?.message || "Đăng ký thất bại");
    }
  };

  const handleGoogleLogin = () => {
    alert("Đăng nhập bằng Google");
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
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập mật khẩu"
          />
          <FieldError message={errors.password} />
        </div>

        {/* XÁC NHẬN */}
        <div className="relative mb-4">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Xác nhận lại mật khẩu"
          />
          <FieldError message={errors.confirmPassword} />
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Đăng Ký
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
            <Button
              variant="outline"
              size="lg"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center px-6 py-3 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
            >
              <FcGoogle className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
