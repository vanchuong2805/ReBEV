import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Category from "@/features/home/components/Category.jsx";
import FeaturedListings from "@/features/home/components/FeaturedListings.jsx";

function Home() {
  return (
    <>
      <Category />
      <FeaturedListings />
    </>
  );
}

export default Home;
