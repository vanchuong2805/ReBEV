import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    // ==== validate đơn giản ====
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại ";
    } else if (
      !/^(0)(3[2-9]|5[25689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(phone)
    )
      newErrors.phone = "Số điện thoại không hợp lệ";

    if (!password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(`Đăng nhập thành công bằng SĐT: ${phone}`);
      // sau này gọi API login() ở đây
    }
  };

  const handleGoogleLogin = () => {
    alert("Đăng nhập bằng Google");
  };

  return (
    <div className="max-w-md p-8 mx-auto bg-transparent border-0 rounded-none shadow-none">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Đăng nhập</h2>
        <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
      </div>

      <form onSubmit={handlePhoneLogin}>
        <div className="relative mb-8">
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <div className="absolute px-2 py-1 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded shadow-sm w-max">
              {errors.phone}
            </div>
          )}
        </div>

        <div className="mb-8">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <div className="absolute px-2 py-1 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded shadow-sm left-13 w-max">
              {errors.password}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Đăng nhập
        </Button>
      </form>

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
    </div>
  );
};

export default LoginForm;
