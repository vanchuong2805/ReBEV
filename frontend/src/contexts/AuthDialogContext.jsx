import React, { createContext, useContext, useState, useMemo } from "react";

const AuthDialogContext = createContext(null);

export function AuthDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
  };
  const openRegister = () => {
    setMode("register");
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  const value = useMemo(
    () => ({ isOpen, mode, openLogin, openRegister, close }),
    [isOpen, mode]
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
    </AuthDialogContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx)
    throw new Error("useAuthDialog must be used within AuthDialogProvider");
  return ctx;
}
