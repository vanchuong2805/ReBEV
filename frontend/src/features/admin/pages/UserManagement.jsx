import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import TitlePage from "../components/TitlePage";
import FilterBar from "../components/FilterBar";
import UserInfo from "../components/UserComponents/UserInfo";
import CreateStaff from "../components/UserComponents/CreateStaff";
import {
  createStaffAccount,
  fetchUsers,
  lockUserAccount,
  unLockUserAccount,
} from "../service";
import { toast } from "sonner";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showStaffForm, setShowStaffForm] = useState(false);
  // removed staff password modal: password changes are handled elsewhere (or via API)
  const [staffFormData, setStaffFormData] = useState({
    email: "",
    phone: "",
  });

  // API User
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const data = async () => {
      const fresh = await fetchUsers();
      setUsers(fresh.users);
    };
    data();
  }, []);

  //---------------------------------------------
  const getStatusColor = (is_locked) => {
    switch (is_locked) {
      case true:
        return "bg-red-100 text-red-800";
      case false:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    // Xử lý cả giá trị số và chuỗi
    switch (role) {
      case 2:
        return "bg-blue-100 text-blue-800";
      case 1:
        return "bg-orange-100 text-orange-800";
      case 0:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 0:
        return "Người dùng";
      case 1:
        return "Nhân viên";
      case 2:
        return "Quản trị viên";
      default:
        return role;
    }
  };

  const handleLockUser = async (userId) => {
    try {
      console.log("Token hiện tại:", localStorage.getItem("token"));
      await lockUserAccount(userId);
      setUsers((prevUsers) =>
        prevUsers?.map((user) =>
          user.id === userId ? { ...user, is_locked: true } : user
        )
      );
      toast.success(`Đã khóa tài khoản: ${userId}`);
    } catch (err) {
      toast.error(`Lỗi khi khóa tài khoản: ${err.message}`);
    }
  };

  console.log(users);
  const handleUnlockUser = async (userId) => {
    try {
      console.log("Token hiện tại:", localStorage.getItem("token"));
      await unLockUserAccount(userId);
      setUsers((prevUsers) =>
        prevUsers?.map((user) =>
          user.id === userId ? { ...user, is_locked: false } : user
        )
      );
      toast.success(`Đã mở khóa tài khoản: ${userId}`);
    } catch (err) {
      toast.error(`Lỗi khi mở khóa tài khoản: ${err.message}`);
    }
  };

  const handleCreateStaff = () => {
    setShowStaffForm(true);
  };

  const handleCloseStaffForm = () => {
    setShowStaffForm(false);
    setStaffFormData({
      email: "",
      phone: "",
    });
  };

  const handleStaffFormSubmit = async (staff) => {
    // Create new staff user

    await createStaffAccount({ email: staff.email, phone: staff.phone })
      .then(() => {
        setUsers((prevUsers) => [...prevUsers, staff]);
        handleCloseStaffForm();
        alert("Tài khoản nhân viên đã được tạo thành công!");
      })
      .catch((error) => {
        console.error("Error creating staff account:", error);
        alert("Đã xảy ra lỗi khi tạo tài khoản nhân viên.");
      });
  };

  // removed password change handlers

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý người dùng"
        description="Xem thông tin người dùng và quản lý trạng thái tài khoản"
      />
      {/* Stats Cards */}

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
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm theo ID, tên hoặc email..."
        selects={[
          {
            key: "status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "all", label: "Tất cả trạng thái" },
              { value: "active", label: "Hoạt động" },
              { value: "locked", label: "Bị khóa" },
            ],
          },
          {
            key: "role",
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { value: "all", label: "Tất cả vai trò" },
              { value: "user", label: "Người dùng" },
              { value: "staff", label: "Nhân viên" },
              { value: "admin", label: "Quản trị viên" },
            ],
          },
        ]}
      />
      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => (
          <UserInfo
            key={user.id}
            user={user}
            handleLockUser={handleLockUser}
            handleUnlockUser={handleUnlockUser}
            getRoleText={getRoleText}
            getRoleColor={getRoleColor}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
      {users.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Không tìm thấy người dùng nào phù hợp với tiêu chí của bạn.
          </p>
        </Card>
      )}
      {/* Staff Creation Modal */}
      <CreateStaff
        staffFormData={staffFormData}
        setStaffFormData={setStaffFormData}
        open={showStaffForm}
        onClose={handleCloseStaffForm}
        onCreate={handleStaffFormSubmit}
      />
      {/* Password change UI removed - staff password change disabled in admin UI */}
    </div>
  );
};

export default UserManagement;
