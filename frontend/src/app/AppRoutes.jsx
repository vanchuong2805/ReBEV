import React from "react";
import { Routes, Route } from "react-router";
import NotFound from "../features/404Page/NotFound.jsx";

import { ROUTES } from "../constants/routes.js";
import Home from "@/features/home/pages/Home";
import ProfilePage from "@/features/profile/pages/ProfilePage.jsx";
import PackagePage from "@/features/package/pages/PackagePage.jsx";
import CartPage from "@/features/cart/pages/Cart.jsx";
import CheckoutPage from "@/features/transactions/pages/CheckoutPage.jsx";
import PostPage from "@/features/posts/pages/MyListingPage.jsx";
import PaymentFail from "@/features/transactions/pages/PaymentFail.jsx";
import PaymentSuccess from "@/features/transactions/pages/PaymentSuccess.jsx";
import HomeLayout from "./layouts/HomeLayout.jsx";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route element={<HomeLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          {/* <Route path={ROUTES.POSTS} element={<PostPage />} /> */}
          <Route path={ROUTES.UPGRADE} element={<PackagePage />} />
          {/* <Route path={ROUTES.CART} element={<CartPage />} /> */}
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        </Route>
        <Route path={ROUTES.SUCCESS} element={<PaymentSuccess />} />
        <Route path={ROUTES.FAIL} element={<PaymentFail />} />
      </Routes>
    </>
  );
}
