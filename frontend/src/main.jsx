import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import { ApolloProvider } from "@apollo/client/react";
import AppRoutes from "./app/AppRoutes.jsx";
import { BrowserRouter } from "react-router";
import AuthOverlay from "@/features/auth/AuthOverlay.jsx";
import { AuthDialogProvider } from "@/contexts/AuthDialogContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/UserContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AuthDialogProvider>
          <UserProvider>
            <AppRoutes />
            <AuthOverlay />
          </UserProvider>
        </AuthDialogProvider>
      </CartProvider>
      <Toaster position="top-center" richColors closeButton />
    </BrowserRouter>
  </React.StrictMode>
);
