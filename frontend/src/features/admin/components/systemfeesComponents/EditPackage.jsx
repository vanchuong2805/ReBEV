import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function EditPackage({ pkg, onEdit }) {
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  const initialData = useMemo(() => {
    if (!pkg) return null;
    return {
      id: pkg.id,
      name: pkg.name || "",
      description: pkg.description || "",
      top: !!pkg.top,
      highlight: !!pkg.highlight,
      duration: pkg.duration ?? 0,
      price: pkg.price ?? 0,
    };
  }, [pkg]);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!formData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onEdit?.(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(initialData);
    navigate(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-md"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Chỉnh sửa gói dịch vụ
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Cập nhật thông tin và đặc quyền cho gói hiện tại.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên gói
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nhập tên gói..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả gói
          </label>
          <Input
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Mô tả gói..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đặc quyền
          </label>
          <div className="space-y-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formData.top}
                onChange={(e) => handleChange("top", e.target.checked)}
              />
              <span className="text-sm text-gray-700">Ưu tiên hiển thị</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formData.highlight}
                onChange={(e) => handleChange("highlight", e.target.checked)}
              />
              <span className="text-sm text-gray-700">Highlight Bài Viết</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời hạn (Ngày)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.duration}
              onChange={(e) => handleChange("duration", Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá gói (VND)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="sm:w-auto"
        >
          Hoàn tác
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 sm:w-auto"
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
