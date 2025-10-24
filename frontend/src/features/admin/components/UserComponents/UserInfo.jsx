import React from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Lock, Mail, Phone, Unlock, User } from "lucide-react";
export default function UserInfo({
  user,
  handleLockUser,
  handleUnlockUser,
  getRoleText,
  getRoleColor,
  getStatusColor,
}) {
  return (
    <>
      <Card key={user.id} className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar - show user's avatar image if available, otherwise show icon */}
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.display_name || user.name || "avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-500" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.display_name || user.name || "N/A"}
                </h3>
                <Badge className={`${getStatusColor(user.is_locked)} border-0`}>
                  {user.is_locked ? "Bị khóa" : "Hoạt động"}
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
                  <span className="text-gray-700">{user.phone || "N/A"}</span>
                </div>
              </div>
              {user.role == 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Tin đăng:</span>
                    <span className="ml-1 font-medium text-blue-600">
                      {user.totalListings || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Giao dịch:</span>
                    <span className="ml-1 font-medium text-green-600">
                      {user.totalTransactions || 0}
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div>
                <span className="text-gray-500">Ngày Tạo:</span>
                <span className="ml-1 text-gray-700">
                  {user.create_at
                    ? new Date(user.create_at).toLocaleDateString("vi-VN")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2 ml-6">
            {/* Show lock/unlock actions for regular users and staff (role 0 and 1) */}
            {user.role !== 2 &&
              (user.is_locked === false ? (
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
    </>
  );
}
