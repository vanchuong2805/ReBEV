import { useState } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { transactionsData } from "../data/data";

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [transactions] = useState(transactionsData);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "verified":
        return "Đã xác minh";
      case "pending":
        return "Chờ xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "purchase":
        return "Mua hàng";
      case "sale":
        return "Bán hàng";
      case "deposit":
        return "Nạp tiền";
      case "withdrawal":
        return "Rút tiền";
      case "refund":
        return "Hoàn tiền";
      default:
        return type;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý giao dịch
        </h1>
        <p className="text-gray-600">
          Xem và theo dõi tất cả giao dịch trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo ID giao dịch hoặc tên người dùng..."
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
              <option value="pending">Chờ xử lý</option>
              <option value="verified">Đã xác minh</option>
              <option value="completed">Hoàn thành</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {transaction.id}
                  </h3>
                  <Badge
                    className={`${getStatusColor(transaction.status)} border-0`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span>{getStatusText(transaction.status)}</span>
                    </div>
                  </Badge>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {getTypeText(transaction.type)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Người dùng</p>
                    <p className="font-medium">{transaction.userName}</p>
                    <p className="text-gray-400 text-xs">
                      {transaction.userId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Số tiền</p>
                    <p className="font-medium text-lg">
                      {transaction.amount.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ngày</p>
                    <p className="font-medium">
                      {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-gray-500 text-sm">Mô tả</p>
                  <p className="text-gray-900">{transaction.description}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Eye size={16} className="mr-1" />
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Không tìm thấy giao dịch nào phù hợp với tiêu chí của bạn.
          </p>
        </Card>
      )}
    </div>
  );
};

export default TransactionManagement;
