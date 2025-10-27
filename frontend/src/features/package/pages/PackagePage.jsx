import React, { useState } from "react";
import {
  CheckCircle2,
  Star,
  Crown,
  Diamond,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MembershipPackage from "../components/MembershipPackage";

const iconById = {
  basic: Star,
  vip1: Crown,
  vip2: Diamond,
};

const formatPrice = (v) => {
  if (v === 0) return "Miễn phí";
  return v.toLocaleString("vi-VN") + "đ";
};

const PackagePage = () => {
  return (
    <div>
      <MembershipPackage />
    </div>
  );
};

export default PackagePage;
