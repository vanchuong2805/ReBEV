import React from "react";
import { Routes, Route, Router } from "react-router";
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
import ListingDetail from "@/features/marketplace/pages/ListingDetail.jsx";
import OrderDetailPage from "@/features/profile/components/order/OrderDetailPage.jsx";
import ListingsSection from "@/features/profile/components/listings/ListingsSection.jsx";
import PurchasesSection from "@/features/profile/components/purchases/PurchasesSection.jsx";
import SalesSection from "@/features/profile/components/sales/SalesSection.jsx";
import TransactionsSection from "@/features/profile/components/transactions/TransactionsSection.jsx";
import SettingsPage from "@/features/profile/components/settings/SettingsPage.jsx";
import FavoritesList from "@/features/profile/components/favorites/FavoritesList.jsx";
import WalletSection from "@/features/profile/components/wallet/WalletSection.jsx";
import AdminDashboard from "@/features/admin/pages/AdminPage.jsx";
import ListingList from "@/features/marketplace/pages/ListingList.jsx";
import ShopPage from "@/features/shop/pages/ShopPage.jsx";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route element={<HomeLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />}>
            <Route path="listings" element={<ListingsSection />} />
            <Route path="purchases" element={<PurchasesSection />} />
            <Route path="sales" element={<SalesSection />} />
            <Route path="favorites" element={<FavoritesList />} />
            <Route path="transactions" element={<TransactionsSection />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="wallet" element={<WalletSection />} />
            <Route path="purchases/:orderId" element={<OrderDetailPage />} />
            <Route path="sale/:orderId" element={<OrderDetailPage />} />
           
          </Route>
          <Route path={ROUTES.POSTS} element={<PostPage />} />
          <Route path={ROUTES.UPGRADE} element={<PackagePage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.MARKETPLACE_CATEGORY} element={<ListingList />} />
          <Route
            path="/marketplace/listing/:listingId"
            element={<ListingDetail />}
          />
           <Route path={`/shop/:sellerId`} element={<ShopPage />} />
        </Route>
        
        <Route path={ROUTES.SUCCESS} element={<PaymentSuccess />} />
        <Route path={ROUTES.FAIL} element={<PaymentFail />} />
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
      </Routes>
    </>
  );
}
