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

  console.log("Package List:", packageList);
  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý phí hệ thống"
        description="Cấu hình phí sàn và gói người dùng"
      />

      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === "platform" &&
        categories.map((category) => {
          const label = category.is_deposit ? "Phí đặt cọc" : "Phí hoa hồng";
          const currentPercent = category.is_deposit
            ? category.deposit_rate
            : category.commission_rate;
          const isEditing = editingId === category.id;

          return (
            <Card
              key={category.id}
              className="m-6 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm">
                    {category.is_deposit ? (
                      <span className="font-medium text-emerald-600">
                        Có đặt cọc
                      </span>
                    ) : (
                      <span className="font-medium text-rose-600">
                        Không đặt cọc
                      </span>
                    )}
                  </p>

                  {/* row hiện số % hoặc input khi edit */}
                  <div className="mt-2">
                    <span className="text-sm text-slate-500">{label}: </span>
                    {!isEditing ? (
                      <span className="text-2xl font-semibold text-blue-600">
                        {currentPercent}%
                      </span>
                    ) : (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="flex items-center rounded-xl border border-slate-300 bg-white px-2 py-1.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={percentInput}
                            onChange={(e) => setPercentInput(e.target.value)}
                            className="w-24 text-right text-2xl font-semibold text-blue-700 outline-none"
                          />
                          <span className="ml-1 text-2xl font-semibold text-blue-700">
                            %
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onSave(category)}
                          disabled={saving}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          {saving ? "Đang lưu..." : "Lưu"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-300"
                          onClick={onCancel}
                          disabled={saving}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Hủy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-slate-300 hover:bg-slate-50"
                    onClick={() => onOpenEdit(category)}
                  >
                    <Pencil size={16} className="mr-1" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </Card>
          );
        })}

      {activeTab === "packages" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddPackage(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thêm gói
            </Button>
          </div>

          <div className="grid gap-6">
            {packageList.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onDelete={handleDeletePackage}
              />
            ))}
          </div>

          <AddPackageModal
            open={showAddPackage}
            onClose={() => setShowAddPackage(false)}
            handleAddPackage={handleAddPackage}
          />
        </div>
      )}
    </div>
  );
}
