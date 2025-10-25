import { useState, useMemo, useEffect } from "react";
import TitlePage from "../components/TitlePage";
import ListingsList from "../components/ListingComponents/ListingsList";
import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import { fetchPost } from "../service";

const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [listings, setListings] = useState([]);
  useEffect(() => {
    fetchPost().then((data) => setListings(data));
  }, []);
  // Handlers
  const handleApprove = (id) =>
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 1 } : l))
    );

  const handleReject = (id) =>
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 2 } : l))
    );

  const handleEdit = (id) => {
    // Change status to pending when edit button is clicked
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 0 } : l))
    );
    console.log("Editing listing and setting status to pending:", id);
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
        listing.id == query || listing.title.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || listing.status == statusFilter;
      const matchesCategory =
        categoryFilter === "all" || listing.category == categoryFilter;
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
          number={listings.filter((l) => l.status === "pending").length}
          description="Chờ duyệt"
          color={"yellow"}
        />
        <StatsCard
          number={listings.filter((l) => l.status === "approved").length}
          description="Đã duyệt"
          color={"green"}
        />
        <StatsCard
          number={listings.filter((l) => l.status === "rejected").length}
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
            onChange: setStatusFilter,
            options: [
              { value: "all", label: "Tất cả trạng thái" },
              { value: "pending", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt" },
              { value: "rejected", label: "Từ chối" },
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
              { value: "Car", label: "Ô tô điện" },
            ],
          },
        ]}
      />
      ;
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
