import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import FieldError from "./FieldError";
import { validateLogin } from "../../../services/validations";
import { loginUser } from "../service";
import { useUser } from "../../../contexts/UserContext";
const LoginForm = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useUser();

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    const newErrors = validateLogin({ phone, password });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    // Call login API
    loginUser({ phone, password })
      .then((response) => {
        console.log("Login successful:", response);
        // Handle successful login (e.g., store token, redirect)
        login(response.user, response.token);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle login error (e.g., show error message)
      });
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
          <FieldError message={errors.phone} />
        </div>

        <div className="relative mb-8">
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
          <FieldError message={errors.password} />
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Đăng nhập
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
