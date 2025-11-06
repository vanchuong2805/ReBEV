import { useState, useEffect } from "react";
import TitlePage from "../components/TitlePage";
import ListingsList from "../components/ListingComponents/ListingsList";
import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import { fetchPost, updatePostStatus } from "../service";
import { toast } from "sonner";
const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    status: "",
    category: "",
  });

  const [posts, setPosts] = useState([]);
  const searchKey =
    "?status=" +
    filSearch.status +
    "&category_id=" +
    filSearch.category +
    "&search=" +
    filSearch.searchTerm;

  useEffect(() => {
    fetchPost(searchKey).then((data) => setPosts(data));
  }, [filSearch]);
  console.log(filSearch);

  const refreshPost = async () => {
    const fresh = await fetchPost();
    setPosts(fresh.map((p) => ({ ...p, status: Number(p.status) })));
  };
  // Handlers
  const handleApprove = async (id) => {
    try {
      console.log("Token hiện tại:", localStorage.getItem("token"));
      await updatePostStatus(id, 1);
      await refreshPost();
      toast.success(`Đã phê duyệt tin đăng: ${id}`);
    } catch (err) {
      toast.error(
        "Phê duyệt thất bại: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleReject = async (id) => {
    try {
      console.log("Token hiện tại:", localStorage.getItem("token"));
      await updatePostStatus(id, 2);
      await refreshPost();
      toast.success(`Đã từ chối tin đăng: ${id}`);
    } catch (err) {
      toast.error(`Lỗi khi từ chối tin đăng: ${err.message}`);
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Token hiện tại:", localStorage.getItem("token"));

      await refreshPost();
      toast.success(`Đã chỉnh sửa tin đăng: ${id}`);
    } catch (err) {
      toast.error(`Lỗi khi chỉnh sửa tin đăng: ${err.message}`);
    }
  };

  const handleViewDetails = (id) => {
    // điều hướng / mở modal
    console.log("Viewing listing details:", id);
  };

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý tin đăng"
        description="Xem xét, phê duyệt và quản lý tin đăng của người dùng"
      />

      <FilterBar
        setFilSearch={setFilSearch}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm theo ID tin đăng, tiêu đề hoặc tên người dùng..."
        selects={[
          {
            key: "status",
            value: statusFilter,
            onChange: (v) => setStatusFilter(v === "all" ? "all" : Number(v)),
            options: [
              { value: "", label: "Tất cả trạng thái" },
              { value: 0, label: "Chờ duyệt" },
              { value: 1, label: "Đã duyệt" },
              { value: 2, label: "Từ chối" },
              { value: 3, label: "Hoàn tất giao dịch" },
              { value: 4, label: "Đang trong quá trình hoàn tất" },
              { value: 5, label: "Đã dừng lại" },
              { value: 6, label: "Đang xác minh" },
              { value: 7, label: "Đang giao dịch" },
            ],
          },
          {
            key: "category",
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: "", label: "Tất cả danh mục" },
              { value: 1, label: "Xe máy điện" },
              { value: 2, label: "Pin xe máy điện" },
            ],
          },
        ]}
      />
      <ListingsList
        listings={posts}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ListingManagement;
