// components/system-fees/AddPackageModal.jsx
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { X } from "lucide-react";

export default function AddPackageModal({
  open,
  onClose,
  newPackage,
  setNewPackage,
  onTogglePrivilege,
  onAdd,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Thêm gói mới</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên gói
            </label>
            <Input
              value={newPackage.name}
              onChange={(e) =>
                setNewPackage({ ...newPackage, name: e.target.value })
              }
              placeholder="Nhập tên gói..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả gói
            </label>
            <Input
              value={newPackage.description}
              onChange={(e) =>
                setNewPackage({ ...newPackage, description: e.target.value })
              }
              placeholder="Mô tả gói..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đặc quyền
            </label>
            <div className="space-y-2">
              {["Ưu tiên hiển thị", "abc"].map((label) => (
                <label key={label} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={newPackage.privileges.includes(label)}
                    onChange={() => onTogglePrivilege(label)}
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá gói (VND)
            </label>
            <Input
              type="number"
              value={newPackage.price}
              onChange={(e) =>
                setNewPackage({ ...newPackage, price: e.target.value })
              }
              placeholder="0"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onAdd}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Thêm gói
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
