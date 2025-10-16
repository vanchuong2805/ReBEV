import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Lock,
  Unlock,
  User,
  Mail,
  Phone,
  Calendar,
  Plus,
  X,
  Key,
  Trash2,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import TitlePage from "../components/TitlePage";
import UserStats from "../components/UserStats";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // API User

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://rebev.onrender.com/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []);

  //---------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "locked":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "staff":
        return "bg-orange-100 text-orange-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "premium":
        return "Premium";
      case "admin":
        return "Quản trị viên";
      case "staff":
        return "Nhân viên";
      case "user":
        return "Người dùng";
      default:
        return role;
    }
  };

  const handleLockUser = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "locked" } : user
      )
    );
    console.log("Locking user:", userId);
  };

  const handleUnlockUser = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "active" } : user
      )
    );
    console.log("Unlocking user:", userId);
  };

  const handleViewDetails = (userId) => {
    console.log("Viewing user details:", userId);
  };

  const handleCreateStaff = () => {
    setShowStaffForm(true);
  };

  const handleCloseStaffForm = () => {
    setShowStaffForm(false);
    setStaffFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleStaffFormSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (staffFormData.password !== staffFormData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (staffFormData.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    // Create new staff user
    const newStaff = {
      id: `STF${String(users.length + 1).padStart(3, "0")}`,
      name: staffFormData.name,
      email: staffFormData.email,
      phone: staffFormData.phone,
      status: "active",
      role: "staff",
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      totalListings: 0,
      totalTransactions: 0,
      verified: true,
    };

    setUsers([...users, newStaff]);
    handleCloseStaffForm();
    alert("Tài khoản nhân viên đã được tạo thành công!");
  };

  const handleStaffFormChange = (field, value) => {
    setStaffFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Chức năng mới cho staff
  const handleChangePassword = (staffId) => {
    setSelectedStaffId(staffId);
    setShowPasswordModal(true);
  };

  const handleDeleteStaff = (staffId) => {
    const staff = users.find((user) => user.id === staffId);
    if (
      confirm(`Bạn có chắc chắn muốn xóa tài khoản nhân viên "${staff.name}"?`)
    ) {
      setUsers(users.filter((user) => user.id !== staffId));
      alert("Đã xóa tài khoản nhân viên thành công!");
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setSelectedStaffId(null);
    setPasswordFormData({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordFormSubmit = (e) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Cập nhật mật khẩu (trong thực tế sẽ gọi API)
    console.log("Cập nhật mật khẩu cho staff ID:", selectedStaffId);
    alert("Đã thay đổi mật khẩu thành công!");
    handlePasswordModalClose();
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý người dùng"
        description="Xem thông tin người dùng và quản lý trạng thái tài khoản"
      />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <UserStats
          numberActiveUsers={users.filter((u) => u.status === "active").length}
          description="Người dùng hoạt động"
          color={"green"}
        />

        <UserStats
          numberActiveUsers={users.filter((u) => u.status === "locked").length}
          description="Người dùng bị khóa"
          color={"red"}
        />
        <UserStats
          numberActiveUsers={users.filter((u) => u.role === "staff").length}
          description="Nhân viên"
          color={"orange"}
        />
        <UserStats
          numberActiveUsers={users.filter((u) => u.role === "admin").length}
          description="Quản trị viên"
          color={"purple"}
        />
        <UserStats
          numberActiveUsers={users.length}
          description="Tổng người dùng"
          color={"blue"}
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleCreateStaff}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo tài khoản nhân viên
        </Button>
      </div>
      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo ID, tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khóa</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="premium">Gói Lay</option>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <Badge
                      className={`${getStatusColor(user.status)} border-0`}
                    >
                      {user.status}
                    </Badge>
                    <Badge className={`${getRoleColor(user.role)} border-0`}>
                      {getRoleText(user.role)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 font-medium">ID:</span>
                      <span>{user.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Tin đăng:</span>
                      <span className="ml-1 font-medium text-blue-600">
                        {user.totalListings}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Giao dịch:</span>
                      <span className="ml-1 font-medium text-green-600">
                        {user.totalTransactions}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Đăng nhập cuối:</span>
                      <span className="ml-1 text-gray-700">
                        {new Date(user.lastLogin).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => handleViewDetails(user.id)}
                >
                  <Eye size={16} className="mr-1" />
                  Xem chi tiết
                </Button>

                {user.role === "staff" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleChangePassword(user.id)}
                    >
                      <Key size={16} className="mr-1" />
                      Đổi mật khẩu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteStaff(user.id)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa tài khoản
                    </Button>
                  </>
                )}

                {user.role !== "staff" &&
                  (user.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleLockUser(user.id)}
                    >
                      <Lock size={16} className="mr-1" />
                      Khóa tài khoản
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleUnlockUser(user.id)}
                    >
                      <Unlock size={16} className="mr-1" />
                      Mở khóa tài khoản
                    </Button>
                  ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Không tìm thấy người dùng nào phù hợp với tiêu chí của bạn.
          </p>
        </Card>
      )}

      {/* Staff Creation Modal */}
      {showStaffForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Tạo tài khoản nhân viên
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseStaffForm}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleStaffFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <Input
                  type="text"
                  value={staffFormData.name}
                  onChange={(e) =>
                    handleStaffFormChange("name", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleStaffFormChange("email", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleStaffFormChange("phone", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleStaffFormChange("password", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleStaffFormChange("confirmPassword", e.target.value)
                  }
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
                  onClick={handleCloseStaffForm}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Thay đổi mật khẩu
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePasswordModalClose}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handlePasswordFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={passwordFormData.newPassword}
                  onChange={(e) =>
                    handlePasswordFormChange("newPassword", e.target.value)
                  }
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={passwordFormData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordFormChange("confirmPassword", e.target.value)
                  }
                  placeholder="Xác nhận mật khẩu mới"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Cập nhật mật khẩu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasswordModalClose}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
