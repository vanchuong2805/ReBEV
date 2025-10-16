import { Search, Filter } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

export default function ListingFiltersBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo ID tin đăng, tiêu đề hoặc tên người dùng..."
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
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Motorcycle">Xe máy</option>
            <option value="Scooter">Xe ga</option>
            <option value="Car">Ô tô</option>
            <option value="Bicycle">Xe đạp</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
