import { useState, useMemo, useEffect } from "react";
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
  const [listings, setListings] = useState([]);
  useEffect(() => {
    fetchPost().then((data) => {
      setListings(data.map((p) => ({ ...p, status: Number(p.status) })));
    });
  }, []);

  const refreshPost = async () => {
    const fresh = await fetchPost();
    setListings(fresh.map((p) => ({ ...p, status: Number(p.status) })));
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

  // Filtered data (memo để tránh render lại không cần thiết)
  const filteredListings = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        String(listing.id) === query ||
        listing.title.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : Number(listing.status) === Number(statusFilter);

      const matchesCategory =
        categoryFilter === "all" ? true : listing.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [listings, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý tin đăng"
        description="Xem xét, phê duyệt và quản lý tin đăng của người dùng"
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatsCard
          number={listings.filter((l) => l.status === 0).length}
          description="Chờ duyệt"
          color={"yellow"}
        />
        <StatsCard
          number={listings.filter((l) => l.status === 1).length}
          description="Đã duyệt"
          color={"green"}
        />
        <StatsCard
          number={listings.filter((l) => l.status === 2).length}
          description="Từ chối"
          color={"red"}
        />
        <StatsCard
          number={listings.length}
          description="Tổng số tin"
          color={"blue"}
        />
      </div>
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm theo ID tin đăng, tiêu đề hoặc tên người dùng..."
        selects={[
          {
            key: "status",
            value: statusFilter,
            onChange: (v) => setStatusFilter(v === "all" ? "all" : Number(v)),
            options: [
              { value: "all", label: "Tất cả trạng thái" },
              { value: 0, label: "Chờ duyệt" },
              { value: 1, label: "Đã duyệt" },
              { value: 2, label: "Từ chối" },
            ],
          },
          {
            key: "category",
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: "all", label: "Tất cả danh mục" },
              { value: "Motorcycle", label: "Xe máy điện" },
              { value: "Pin", label: "Pin xe máy điện" },
            ],
          },
        ]}
      />
      <ListingsList
        listings={filteredListings}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ListingManagement;
