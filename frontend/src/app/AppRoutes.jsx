import React from "react";
import { Routes, Route } from "react-router";
import NotFound from "../features/404Page/NotFound.jsx";
import { ROUTES } from "../constants/routes.js";
import { ROLES } from "../constants/roles.js";
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx";
import Home from "@/features/home/pages/Home";
import ProfilePage from "@/features/profile/pages/ProfilePage.jsx";
import PackagePage from "@/features/package/pages/PackagePage.jsx";
import CartPage from "@/features/cart/pages/Cart.jsx";
import CheckoutPage from "@/features/transactions/pages/CheckoutPage.jsx";
import PostPage from "@/features/posts/pages/MyListingPage.jsx";
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
import AdminDashboard from "../features/admin/pages/AdminPage.jsx";
import ListingList from "@/features/marketplace/pages/ListingList.jsx";
import ShopPage from "@/features/shop/pages/ShopPage.jsx";
import ChatPage from "@/features/chat/pages/ChatPage.jsx";
import UserManagement from "@/features/admin/pages/UserManagement.jsx";
import ReportsStatistics from "@/features/admin/pages/ReportsStatistics.jsx";
import ListingManagement from "@/features/admin/pages/ListingManagement.jsx";
import SystemFeesManagement from "@/features/admin/pages/SystemFeesManagement.jsx";
import TransactionManagement from "@/features/admin/pages/TransactionManagement.jsx";
import DepositPage from "@/features/transactions/pages/DepositPage.jsx";
import ForgotPhonePage from "@/features/auth/pages/ForgotPhonePage.jsx";
import NewPasswordPage from "@/features/auth/pages/NewPasswordPage.jsx";
import OtpPage from "@/features/auth/pages/OtpPage.jsx";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />

        {/* Guest và Member Routes */}
        <Route element={<HomeLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />

          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.MEMBER, ROLES.STAFF]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
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

          {/* Posts - CHỈ route này cần package */}
          <Route
            path={ROUTES.POSTS}
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.MEMBER]}
                requiresPackage={true}
              >
                <PostPage />
              </ProtectedRoute>
            }
          />

          {/* Các route khác - KHÔNG cần package */}
          <Route
            path={ROUTES.CHECKOUT}
            element={
              <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.UPGRADE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                <PackagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CART}
            element={
              <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DEPOSIT}
            element={
              <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                <DepositPage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.MARKETPLACE_CATEGORY} element={<ListingList />} />
          <Route
            path="/marketplace/listing/:listingId"
            element={<ListingDetail />}
          />
          <Route path={`/shop/:sellerId`} element={<ShopPage />} />
        </Route>

        {/* Admin-only routes - Member không được vào */}
        <Route
          path={ROUTES.ADMIN.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<UserManagement />} />
          <Route index element={<ReportsStatistics />} />
          <Route path="listings" element={<ListingManagement />} />
          <Route path="fees" element={<SystemFeesManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
        </Route>
        <Route path={"chat"} element={<ChatPage />} />
        <Route path={"forgot"} element={<ForgotPhonePage />} />
        <Route path={"forgot/new"} element={<NewPasswordPage />} />
        <Route path={"forgot/otp"} element={<OtpPage />} />
      </Routes>
    </>
  );
}
