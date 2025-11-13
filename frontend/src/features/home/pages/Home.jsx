import React, { useEffect } from "react";
import Promotions from "../components/PromotionBanner";
import FeaturedListings from "@/features/home/components/FeaturedListings.jsx";
import Banner from "../components/Banner";

function Home() {
  useEffect(() => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }, []);
  return (
    <>
      <Banner />
      <Promotions />
      <FeaturedListings />
    </>
  );
}

export default Home;
