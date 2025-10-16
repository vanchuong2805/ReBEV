// components/system-fees/PackageCard.jsx
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Edit, Save, X } from "lucide-react";
import { formatVND } from "../../service";

export default function PackageCard({
  pkg,
  onStartEdit,
  onSave,
  onCancel,
  onChangePrice,
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {pkg.name}
          </h3>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Mô tả:</p>
            <p className="text-sm text-gray-600">{pkg.description}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Đặc quyền:</p>
            <ul className="list-disc list-inside space-y-1">
              {pkg.privileges.map((p, i) => (
                <li key={i} className="text-sm text-gray-600">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Giá gói:</p>
              {pkg.isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => onChangePrice(pkg.id, e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">VND</span>
                </div>
              ) : (
                <p className="text-xl font-bold text-blue-600">
                  {formatVND(pkg.price)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          {pkg.isEditing ? (
            <>
              <Button
                onClick={() => onSave(pkg.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save size={16} />
              </Button>
              <Button
                onClick={() => onCancel(pkg.id)}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X size={16} />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onStartEdit(pkg.id)}
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Edit size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
