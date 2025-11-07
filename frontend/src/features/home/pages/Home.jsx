import React from "react";
import Promotions from "../components/PromotionBanner";
import FeaturedListings from "@/features/home/components/FeaturedListings.jsx";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";

function Home() {
  return (
    <>
      <Banner />
      <Promotions />
      <FeaturedListings />
    </>
  );
}

export default Home;
