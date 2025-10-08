import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Paperclip,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { complaintsData } from "../data/data";

const ComplaintManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [complaints, setComplaints] = useState(complaintsData);

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "resolved":
        return "Đã giải quyết";
      case "in_progress":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "refund":
        return "Yêu cầu hoàn tiền";
      case "seller_issue":
        return "Vấn đề người bán";
      case "payment_issue":
        return "Vấn đề thanh toán";
      case "scam_report":
        return "Báo cáo lừa đảo";
      case "service_quality":
        return "Chất lượng dịch vụ";
      case "technical_issue":
        return "Vấn đề kỹ thuật";
      default:
        return type;
    }
  };

  const handleApprove = (complaintId) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status: "resolved",
              resolvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : complaint
      )
    );
    console.log("Approving complaint:", complaintId);
  };

  const handleReject = (complaintId) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status: "rejected",
              resolvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : complaint
      )
    );
    console.log("Rejecting complaint:", complaintId);
  };

  const handleStartProcessing = (complaintId) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status: "in_progress",
              updatedAt: new Date().toISOString(),
            }
          : complaint
      )
    );
    console.log("Starting to process complaint:", complaintId);
  };

  const handleViewDetails = (complaintId) => {
    console.log("Viewing complaint details:", complaintId);
    // Navigate to complaint details page
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.complaintNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.orderNumber &&
        complaint.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    const matchesType = typeFilter === "all" || complaint.type === typeFilter;

    const matchesPriority =
      priorityFilter === "all" || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý khiếu nại
        </h1>
        <p className="text-gray-600">
          Xem và xử lý tất cả khiếu nại từ người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {complaints.filter((c) => c.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {complaints.filter((c) => c.status === "in_progress").length}
            </p>
            <p className="text-sm text-gray-600">Đang xử lý</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {complaints.filter((c) => c.status === "resolved").length}
            </p>
            <p className="text-sm text-gray-600">Đã giải quyết</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {complaints.filter((c) => c.priority === "high").length}
            </p>
            <p className="text-sm text-gray-600">Ưu tiên cao</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {complaints.length}
            </p>
            <p className="text-sm text-gray-600">Tổng khiếu nại</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã khiếu nại, tên người dùng, mã đơn hàng..."
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
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả loại</option>
              <option value="refund">Hoàn tiền</option>
              <option value="seller_issue">Vấn đề người bán</option>
              <option value="payment_issue">Vấn đề thanh toán</option>
              <option value="scam_report">Báo cáo lừa đảo</option>
              <option value="service_quality">Chất lượng dịch vụ</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Complaints List */}
      <div className="space-y-6">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Complaint Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {complaint.complaintNumber}
                      </h3>
                      <Badge
                        className={`${getStatusColor(
                          complaint.status
                        )} border-0`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(complaint.status)}
                          <span>{getStatusText(complaint.status)}</span>
                        </div>
                      </Badge>
                      <Badge
                        className={`${getPriorityColor(
                          complaint.priority
                        )} border-0`}
                      >
                        {getPriorityText(complaint.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{getTypeText(complaint.type)}</span>
                      <span>•</span>
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                      {complaint.orderNumber && (
                        <>
                          <span>•</span>
                          <span>Đơn hàng: {complaint.orderNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {complaint.subject}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Người khiếu nại</p>
                    </div>
                    <p className="font-medium">{complaint.userName}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{complaint.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{complaint.userPhone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Nhân viên xử lý</p>
                    </div>
                    <p className="font-medium">
                      {complaint.assignedToName || "Chưa phân công"}
                    </p>
                    {complaint.amount > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-blue-600">
                        <DollarSign className="h-3 w-3" />
                        <span>
                          {complaint.amount.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {complaint.listingTitle && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Sản phẩm liên quan
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {complaint.listingTitle}
                    </p>
                  </div>
                )}

                {complaint.evidenceFiles &&
                  complaint.evidenceFiles.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Tài liệu đính kèm
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {complaint.evidenceFiles.map((file, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {complaint.resolution && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-800 font-medium">
                        Giải pháp
                      </p>
                    </div>
                    <p className="text-sm text-green-700">
                      {complaint.resolution}
                    </p>
                  </div>
                )}

                {complaint.adminNotes && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-800 font-medium">
                        Ghi chú admin
                      </p>
                    </div>
                    <p className="text-sm text-blue-700">
                      {complaint.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => handleViewDetails(complaint.id)}
                >
                  <Eye size={16} className="mr-1" />
                  Xem chi tiết
                </Button>

                {complaint.status === "pending" && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStartProcessing(complaint.id)}
                  >
                    <Clock size={16} className="mr-1" />
                    Bắt đầu xử lý
                  </Button>
                )}

                {complaint.status === "in_progress" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(complaint.id)}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Giải quyết
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(complaint.id)}
                    >
                      <XCircle size={16} className="mr-1" />
                      Từ chối
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Không tìm thấy khiếu nại nào phù hợp với tiêu chí của bạn.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ComplaintManagement;
