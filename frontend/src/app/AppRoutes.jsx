import React from "react";
import { Routes, Route } from "react-router";
import NotFound from "../features/404Page/NotFound.jsx";
import Header from "@/components/common/Header.jsx"; 
import ProfilePage from "@/features/profile/pages/ProfilePage.jsx";


export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/header" element={<Header />} />
        <Route path="/profile" element={<div><ProfilePage /></div>} />
      </Routes>
    </>
  );
}
