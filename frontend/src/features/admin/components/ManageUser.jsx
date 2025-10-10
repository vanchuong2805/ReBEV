import React, { useState } from "react";

// Component bảng thông tin người dùng
function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState([
    {
      id: 1,
      email: "admin@rebev.com",
      phone: "0123456789",
      password: "••••••••",
      displayName: "Admin User",
      citizen_id: "123456789012",
      isBlocked: false,
    },
    {
      id: 2,
      email: "user1@gmail.com",
      phone: "0987654321",
      password: "••••••••",
      displayName: "Nguyễn Văn A",
      citizen_id: "234567890123",
      isBlocked: false,
    },
    {
      id: 3,
      email: "user2@yahoo.com",
      phone: "0369852147",
      password: "••••••••",
      displayName: "Trần Thị B",
      citizen_id: "345678901234",
      isBlocked: true,
    },
    {
      id: 4,
      email: "user3@hotmail.com",
      phone: "0258741369",
      password: "••••••••",
      displayName: "Lê Văn C",
      citizen_id: "456789012345",
      isBlocked: false,
    },
    {
      id: 5,
      email: "user4@outlook.com",
      phone: "0147258369",
      password: "••••••••",
      displayName: "Phạm Thị D",
      citizen_id: "567890123456",
      isBlocked: true,
    },
  ]);

  // Hàm xử lý block/unblock user
  const handleToggleBlock = (userId) => {
    setUserData((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  // Lọc dữ liệu người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = userData.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.citizen_id.includes(searchTerm) ||
      user.id.toString().includes(searchTerm)
  );

  return (
    <div className="card bg-dark text-white mb-3">
      <div className="card-header">
        <h5 className="card-title mb-0">Thông tin người dùng</h5>
      </div>
      <div className="card-body">
        {/* Ô tìm kiếm */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-secondary">
              <i className="fas fa-search text-white"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary text-white"
              placeholder="Tìm kiếm theo tên, email, số điện thoại, CCCD hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                "::placeholder": {
                  color: "#adb5bd",
                },
              }}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm("")}
                title="Xóa tìm kiếm"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          {searchTerm && (
            <small className="text-muted mt-1 d-block">
              Tìm thấy {filteredUsers.length} kết quả cho "{searchTerm}"
            </small>
          )}
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Email</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Mật khẩu</th>
                <th scope="col">Tên hiển thị</th>
                <th scope="col">CCCD</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={user.isBlocked ? "table-danger" : ""}
                  >
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.password}</td>
                    <td>{user.displayName}</td>
                    <td>{user.citizen_id}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.isBlocked ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.isBlocked ? "btn-success" : "btn-danger"
                        }`}
                        onClick={() => handleToggleBlock(user.id)}
                        title={
                          user.isBlocked
                            ? "Mở khóa người dùng"
                            : "Khóa người dùng"
                        }
                      >
                        {user.isBlocked ? (
                          <>
                            <i className="fas fa-unlock me-1"></i>
                            Unlock
                          </>
                        ) : (
                          <>
                            <i className="fas fa-lock me-1"></i>
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    Không tìm thấy người dùng nào phù hợp với từ khóa "
                    {searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ManageUser() {
  return (
    <>
      <h1 className="mb-3">Quản lý người dùng</h1>

      {/* Hiển thị bảng thông tin người dùng */}
      <UserTable />
    </>
  );
}
