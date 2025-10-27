import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function MemberLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-10 ">
        <Outlet />
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
