// pages/SystemFeesManagement.jsx
import { useState } from "react";
import { DollarSign, Package as PackageIcon } from "lucide-react";
import { systemFeesData } from "../data/data";
import TitlePage from "../components/TitlePage";
import Tabs from "../components/systemfeesComponents/Tabs";
import PlatformFeesPanel from "../components/systemfeesComponents/PlatformFeesPanel";
import PackageCard from "../components/systemfeesComponents/PackageCard";
import AddPackageModal from "../components/systemfeesComponents/AddPackageModal";
import { Button } from "../../../components/ui/button";
import { usePlatformFees } from "../../admin/hook/usePlatformFees";
import { useUserPackages } from "../../admin/hook/useUserPackages";

const categoryOptions = [
  { value: "xe-may-dien", label: "Xe máy điện" },
  { value: "pin-xe-may-dien", label: "Pin xe máy điện" },
];

const tabs = [
  { id: "platform", label: "Phí sàn", icon: DollarSign },
  { id: "packages", label: "Gói người dùng", icon: PackageIcon },
];

export default function SystemFeesManagement() {
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
  const {
    userPackages,
    showAddPackage,
    setShowAddPackage,
    newPackage,
    setNewPackage,
    startEdit,
    saveEdit,
    cancelEdit,
    changePrice,
    togglePrivilege,
    add,
  } = useUserPackages(systemFeesData[1]);

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
            {userPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onStartEdit={startEdit}
                onSave={saveEdit}
                onCancel={cancelEdit}
                onChangePrice={changePrice}
              />
            ))}
          </div>

          <AddPackageModal
            open={showAddPackage}
            onClose={() => setShowAddPackage(false)}
            newPackage={newPackage}
            setNewPackage={setNewPackage}
            onTogglePrivilege={togglePrivilege}
            onAdd={add}
          />
        </div>
      )}
    </div>
  );
}
