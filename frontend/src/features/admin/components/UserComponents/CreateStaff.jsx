import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { X } from "lucide-react";

/**
 * CreateStaff modal
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onCreate: (payload: {name,email,phone,password}) => void
 */
export default function CreateStaff({
  open,
  onClose,
  onCreate,
  staffFormData,
  setStaffFormData,
}) {
  const handleChange = (field, value) =>
    setStaffFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {

    if (staffFormData.password !== staffFormData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (staffFormData.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    onCreate({
      name: staffFormData.name.trim(),
      email: staffFormData.email.trim(),
      phone: staffFormData.phone.trim(),
      password: staffFormData.password,
    });

    // reset form và để parent đóng modal (hoặc bạn có thể tự đóng ở đây)
    setStaffFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Tạo tài khoản nhân viên
          </h2>
          <Button variant="outline" size="sm" onClick={onClose} className="p-1">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <Input
              type="text"
              value={staffFormData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập họ tên nhân viên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={staffFormData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Nhập email nhân viên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <Input
              type="tel"
              value={staffFormData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại nhân viên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <Input
              type="password"
              value={staffFormData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <Input
              type="password"
              value={staffFormData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Tạo tài khoản nhân viên
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
