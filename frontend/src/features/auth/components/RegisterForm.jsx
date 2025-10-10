import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    //======Nhập tên========
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (formData.name.length < 3) {
      newErrors.name = "Tên quá ngắn, vui lòng nhập đầy đủ họ tên";
    }
    //======Nhập số điện thoại========
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^(0)(3[2-9]|5[25689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    //======Nhập mật khẩu========
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự";
    }
    //======Xác nhận mật khẩu========
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);

      toast.success("Đăng ký thành công!", {
        description: "Chào mừng bạn đến với ReBev",
        duration: 3000,
      });
      setFormData({ name: "", phone: "", password: "", confirmPassword: "" });
      setErrors({});
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
        {/* ==== NHẬP TÊN ==== */}
        <div className="relative mb-8">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tên của bạn"
          />
          {errors.name && (
            <div className="absolute px-2 py-1 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded shadow-sm w-max">
              {errors.name}
            </div>
          )}
        </div>
        {/* ==== NHẬP SỐ ĐIỆN THOẠI ==== */}
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
          {errors.phone && (
            <div className="absolute px-2 py-1 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded shadow-sm w-max">
              {errors.phone}
            </div>
          )}
        </div>
        {/* ==== NHẬP MẬT KHẨU ==== */}
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
          {errors.password && (
            <div className="absolute px-2 py-1 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded shadow-sm w-max">
              {errors.password}
            </div>
          )}
        </div>

        {/* ==== XÁC NHẬN MẬT KHẨU ==== */}
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
          {errors.confirmPassword && (
            <div className="absolute px-2 py-1 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded shadow-sm w-max">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Đăng Ký
        </button>

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
