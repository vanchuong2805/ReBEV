import React from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useAuthDialog } from "@/contexts/AuthDialogContext";

export default function AuthOverlay() {
  const { isOpen, mode, close, openLogin, openRegister } = useAuthDialog();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]"
      onClick={close}
    >
      <div
        className="bg-white rounded-lg p-5 relative max-w-md w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2.5 right-4 text-2xl hover:text-gray-600"
          onClick={close}
        >
          ×
        </button>

        <div className="flex mb-4">
          <button
            className={`flex-1 px-4 py-2 border-b-2 ${
              mode === "login"
                ? "border-blue-600 text-blue-600"
                : "border-gray-200 text-gray-600"
            }`}
            onClick={openLogin}
          >
            Đăng Nhập
          </button>
          <button
            className={`flex-1 px-4 py-2 border-b-2 ${
              mode === "register"
                ? "border-blue-600 text-blue-600"
                : "border-gray-200 text-gray-600"
            }`}
            onClick={openRegister}
          >
            Đăng Ký
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm onClose={close} />
        ) : (
          <RegisterForm onClose={close} />
        )}
      </div>
    </div>
  );
}
