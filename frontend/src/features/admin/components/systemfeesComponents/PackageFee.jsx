// pages/PackageFee.jsx
import { useEffect, useState } from "react";
import { createPackage, deletePackage, getFullPackage } from "../../service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PackageCard from "./PackageCard";
import AddPackageModal from "./AddPackageModal";

export default function PackageFee() {
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [packageList, setPackageList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFullPackage();
      setPackageList(data || []);
    };
    fetchData();
  }, []);

  const handleAddPackage = async (newPackage) => {
    try {
      const data = await createPackage(newPackage);
      console.log(data);
      setPackageList((prev) => [data.package, ...prev]);
      toast.success("Đã thêm gói mới");
      setShowAddPackage(false);
    } catch (e) {
      toast.error("Thêm gói thất bại " + (e?.message || ""));
    }
  };

  const handleDeletePackage = async (packageId) => {
    try {
      await deletePackage(packageId);
      setPackageList((prev) =>
        prev.map((pkg) =>
          pkg.id === packageId ? { ...pkg, is_deleted: true } : pkg
        )
      );
      toast.success("Đã xóa gói");
    } catch (e) {
      toast.error("Xóa gói thất bại " + (e?.message || ""));
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShowAddPackage(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm gói
        </Button>
      </div>

      <div className="grid gap-6">
        {packageList.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onDelete={handleDeletePackage} />
        ))}
      </div>

      <AddPackageModal
        open={showAddPackage}
        onClose={() => setShowAddPackage(false)}
        handleAddPackage={handleAddPackage}
      />
    </div>
  );
}
