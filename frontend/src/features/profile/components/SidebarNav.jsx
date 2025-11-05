import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Car,
  FileText,
  Heart,
  ShoppingCart,
  Package,
  Edit3,
  LogOut,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const current = location.pathname.split("/").pop();

  const Item = ({ path, icon: Icon, label }) => (
    <button
      onClick={() => navigate(`/profile/${path}`)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
        current === path
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
          : "text-gray-700"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Menu điều hướng</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1">
          <Item path="listings" icon={Car} label="Tin đăng" />
          <Item path="purchases" icon={ShoppingCart} label="Đơn mua" />
          <Item path="sales" icon={Package} label="Đơn bán" />
          <Item path="transactions" icon={FileText} label="Giao dịch" />
          <Item path="favorites" icon={Heart} label="Quan tâm" />
          <Item path="settings" icon={Edit3} label="Chỉnh sửa" />
          <Item path="wallet" icon={Wallet} label="Ví ReBEV" />
        </nav>
      </CardContent>
    </Card>
  );
};

export default SidebarNav;
