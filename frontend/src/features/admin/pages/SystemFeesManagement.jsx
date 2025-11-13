// pages/SystemFeesManagement.jsx
import { useEffect, useState } from "react";
import { DollarSign, Package as PackageIcon, X } from "lucide-react";
import TitlePage from "../components/TitlePage";
import Tabs from "../components/systemfeesComponents/Tabs";
import PackageCard from "../components/systemfeesComponents/PackageCard";
import AddPackageModal from "../components/systemfeesComponents/AddPackageModal";
import { Button } from "../../../components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Check } from "lucide-react";
import {
  createPackage,
  deletePackage,
  getCategory,
  getFullPackage,
  updateCategory,
} from "../service";
import { toast } from "sonner";
import { Outlet, useNavigate } from "react-router";

const tabs = [
  { id: "platform", label: "Phí sàn", icon: DollarSign },
  { id: "packages", label: "Gói người dùng", icon: PackageIcon },
];
export default function SystemFeesManagement() {
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const [activeTab, setActiveTab] = useState("platform");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [percentInput, setPercentInput] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    // Giả sử fetchCategories là hàm lấy danh mục từ API
    const fetchCategories = async () => {
      const data = await getCategory();
      setCategories(data);
    };
    fetchCategories();
  }, []);
  console.log(categories);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFullPackage();
      setPackageList(data);
    };
    fetchData();
  }, []);

  const handleAddPackage = (newPackage) => {
    createPackage(newPackage);
    setPackageList([...packageList, newPackage]);
    toast.success("Đã thêm gói mới");
  };
  const handleDeletePackage = (packageId) => {
    deletePackage(packageId);
    setPackageList(
      packageList.map((pkg) => {
        if (pkg.id === packageId) {
          return { ...pkg, is_deleted: true };
        }
        return pkg;
      })
    );
    toast.success("Đã xóa gói");
  };

  const onOpenEdit = (category) => {
    setEditingId(category.id);
    const current = category.is_deposit
      ? category.deposit_rate
      : category.commission_rate;
    setPercentInput(String(current ?? 0));
  };
  const onCancel = () => {
    setEditingId(null);
    setPercentInput("");
  };

  const onSave = async (category) => {
    const num = Number(percentInput);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      toast.error("Phần trăm phải trong khoảng 0–100.");
      return;
    }
    try {
      setSaving(true);
      await updateCategory(category.id, num); // backend chỉ cần id & percent
      // update UI ngay
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? category.is_deposit
              ? { ...c, deposit_rate: num }
              : { ...c, commission_rate: num }
            : c
        )
      );
      toast.success("Đã cập nhật phần trăm");
      onCancel();
    } catch (e) {
      toast.error("Cập nhật thất bại " + e.message);
    } finally {
      setSaving(false);
    }
  };
  // User packages
  const navigate = useNavigate();
  console.log("Package List:", packageList);
  return (
    <>
      <div className="p-6">
        <TitlePage
          title="Quản lý phí hệ thống"
          description="Cấu hình phí sàn và gói người dùng"
        />

        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(e) => {
            console.log(e);
            setActiveTab(e);
            if (e === "platform") navigate(`/admin/fees/system`);
            else navigate(`/admin/fees/package`);
          }}
        />
      </div>
      <Outlet />
    </>
  );
}
