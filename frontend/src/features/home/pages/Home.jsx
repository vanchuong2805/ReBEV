import React, { useEffect } from "react";
import Promotions from "../components/PromotionBanner";
import FeaturedListings from "@/features/home/components/FeaturedListings.jsx";
import Banner from "../components/Banner";
import { useUser } from "@/contexts/UserContext"

function Home() {
  const { setUser } = useUser()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCode = params.get("resultCode");
    const extraData = params.get("extraData");
    console.log("Result Code:", resultCode);
    console.log("Extra Data:", extraData);
    const savedUser = JSON.parse(localStorage.getItem("user"));
    let extra = null
    try {
      extra = JSON.parse(extraData)
    } catch (err) {
      console.error("Cannot parse extraData:", err)
    }
    if (resultCode == "0") {
      const updatedUser = { ...savedUser,  package_id: Number(extra.package_id), package_start: new Date().toISOString() }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      if (setUser) setUser(updatedUser)
    }
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
