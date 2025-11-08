import { logoutUser } from "@/features/auth/service";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthDialog } from "./AuthDialogContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { close } = useAuthDialog();
  useEffect(() => {
    // Check if user is logged in on app start
    const initAuth = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
      } catch (error) {
        console.error("Error during initialization:", error);
      }

      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      close();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
//eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
