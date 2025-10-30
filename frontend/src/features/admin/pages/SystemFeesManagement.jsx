// pages/SystemFeesManagement.jsx
import { useEffect, useState } from "react";
import { DollarSign, Package as PackageIcon } from "lucide-react";
import { systemFeesData } from "../data/data";
import TitlePage from "../components/TitlePage";
import Tabs from "../components/systemfeesComponents/Tabs";
import PlatformFeesPanel from "../components/systemfeesComponents/PlatformFeesPanel";
import PackageCard from "../components/systemfeesComponents/PackageCard";
import AddPackageModal from "../components/systemfeesComponents/AddPackageModal";
import { Button } from "../../../components/ui/button";
import { usePlatformFees } from "../../admin/hook/usePlatformFees";
import {
  createPackage,
  deletePackage,
  getFullPackage,
  updatePackage,
} from "../service";
import { toast } from "sonner";

const categoryOptions = [
  { value: "xe-may-dien", label: "Xe máy điện" },
  { value: "pin-xe-may-dien", label: "Pin xe máy điện" },
];

const tabs = [
  { id: "platform", label: "Phí sàn", icon: DollarSign },
  { id: "packages", label: "Gói người dùng", icon: PackageIcon },
];

export default function SystemFeesManagement() {
  const [packageList, setPackageList] = useState([]);

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
    setPackageList(packageList.filter((pkg) => pkg.id !== packageId));
    toast.success("Đã xóa gói");
  };
  const handleEditPackage = async (updatedPackage) => {
    const newPackage = await updatePackage(updatedPackage);
    console.log("New package:", newPackage);
    console.log("Old Package :", updatedPackage);
    setPackageList([
      ...packageList.filter((pkg) => pkg.id !== updatedPackage.id),
      newPackage.package,
    ]);

    toast.success("Đã cập nhật gói");
  };

  const [activeTab, setActiveTab] = useState("platform");
  // Platform fees
  const {
    platformFees,
    selectedCategory,
    setSelectedCategory,
    isEditing,
    setIsEditing,
    handleChange,
    save,
  } = usePlatformFees(systemFeesData[0]);

  // User packages
  const [showAddPackage, setShowAddPackage] = useState(false);

  console.log("Package List:", packageList);
  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý phí hệ thống"
        description="Cấu hình phí sàn và gói người dùng"
      />

      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === "platform" && (
        <PlatformFeesPanel
          platformFees={platformFees}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onChange={handleChange}
          onSave={() => {
            save();
            console.log(
              "Saving platform fees:",
              platformFees[selectedCategory]
            );
          }}
          categoryOptions={categoryOptions}
        />
      )}

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
                onEdit={handleEditPackage}
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
