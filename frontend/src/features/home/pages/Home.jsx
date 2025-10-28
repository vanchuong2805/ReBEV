import React from "react";
import Promotions from "../components/PromotionBanner";
import FeaturedListings from "@/features/home/components/FeaturedListings.jsx";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="container mx-auto my-8 text-center">
        <Link to="/admin">Go to Admin</Link>

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Chào mừng bạn đến với <span className="text-blue-600">ReBEV</span>
        </h1>
        <p className="text-lg text-gray-600">
          Nền tảng mua bán xe và pin điện cũ — khám phá những lựa chọn phù hợp
          nhất cho bạn ngay hôm nay!
        </p>
      </div>
      <Promotions />
      <FeaturedListings />
    </>
  );
}

export default Home;
