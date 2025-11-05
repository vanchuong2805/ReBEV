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
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FavoriteProvider } from "@/contexts/FavoritesContexts.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthDialogProvider>
      <UserProvider>
        <CartProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <FavoriteProvider>
              <AppRoutes />
            </FavoriteProvider>
            <AuthOverlay />
          </GoogleOAuthProvider>
        </CartProvider>
      </UserProvider>
    </AuthDialogProvider>
    <Toaster position="top-center" richColors closeButton />
  </BrowserRouter>
);
