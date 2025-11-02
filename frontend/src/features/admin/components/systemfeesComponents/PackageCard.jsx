// components/system-fees/PackageCard.jsx
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Edit, Save, Trash, TrashIcon, X } from "lucide-react";
import EditPackage from "./EditPackage";
import { useState } from "react";
export default function PackageCard({ pkg, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
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
              {pkg.highlight && (
                <li className="text-sm text-gray-600">Highlight Bài Viết</li>
              )}
              {pkg.top && (
                <li className="text-sm text-gray-600">Ưu Tiên Hiển Thị</li>
              )}
              {pkg.duration && (
                <li className="text-sm text-gray-600">
                  Thời gian sử dụng: {pkg.duration} Ngày
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <Button
            onClick={() => onDelete(pkg.id)}
            className="border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
          >
            <Trash size={16} />
          </Button>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
            className="border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
          >
            <Edit size={16} />
          </Button>
        </div>
      </div>
      {isEditing && <EditPackage pkg={pkg} onEdit={onEdit} />}

      {pkg.is_deleted && "gói đã xóa"}
    </Card>
  );
}
