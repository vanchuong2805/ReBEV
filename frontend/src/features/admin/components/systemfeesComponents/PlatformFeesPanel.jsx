// components/system-fees/PlatformFeesPanel.jsx
import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Save, X, Edit } from "lucide-react";
import CategorySelect from "./CategorySelect";
import EditableNumberField from "./EditableNumberField";
import { Card } from "../../../../components/ui/card";

export default function PlatformFeesPanel({
  platformFees,
  selectedCategory,
  setSelectedCategory,
  isEditing,
  setIsEditing,
  onChange,
  onSave,
  categoryOptions,
}) {
  const currentFees = platformFees[selectedCategory];
  // Bỏ logic riêng cho pin xe máy điện
  const [isDepositItemEnabled, setIsDepositItemEnabled] = useState(
    currentFees.depositFee > 0
  );

  // Reset deposit item enabled state when category changes
  useEffect(() => {
    setIsDepositItemEnabled(currentFees.depositFee > 0);
  }, [selectedCategory, currentFees.depositFee]);

  return (
    <div className="space-y-6">
      <CategorySelect
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={categoryOptions}
        disabled={isEditing}
      />

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {currentFees.depositItem}
            </p>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDepositItemEnabled}
                onChange={(e) => {
                  setIsDepositItemEnabled(e.target.checked);
                  if (!e.target.checked) {
                    onChange("depositFee", 0);
                  }
                }}
                disabled={!isEditing}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Mặt hàng đặt cọc
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableNumberField
              label="Phí đặt cọc"
              value={!isDepositItemEnabled ? 0 : currentFees.depositFee}
              suffix={"%"}
              disabled={!isDepositItemEnabled}
              editing={isEditing}
              onChange={(val) => onChange("depositFee", val)}
            />
            <EditableNumberField
              label="Phí hoa hồng"
              value={currentFees.commissionFee}
              suffix="%"
              disabled={false}
              editing={isEditing}
              onChange={(val) => onChange("commissionFee", val)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            {isEditing ? (
              <>
                <Button
                  onClick={onSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save size={16} className="mr-2" /> Lưu
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X size={16} className="mr-2" /> Hủy
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Edit size={16} className="mr-2" /> Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
