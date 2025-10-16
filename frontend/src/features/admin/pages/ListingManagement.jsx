import { useState, useMemo } from "react";
import TitlePage from "../components/TitlePage";
import { listingsData } from "../data";
import StatsCards from "../components/ListingComponents/StatsCards";
import ListingFiltersBar from "../components/ListingComponents/ListingFiltersBar";
import ListingsList from "../components/ListingComponents/ListingsList";

const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [listings, setListings] = useState(listingsData);

  // Handlers
  const handleApprove = (id) =>
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l))
    );

  const handleReject = (id) =>
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "rejected" } : l))
    );

  const handleViewDetails = (id) => {
    // điều hướng / mở modal
    console.log("Viewing listing details:", id);
  };

  // Filtered data (memo để tránh render lại không cần thiết)
  const filteredListings = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        listing.id.toLowerCase().includes(query) ||
        listing.title.toLowerCase().includes(query) ||
        listing.userName.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || listing.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || listing.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [listings, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý tin đăng"
        description="Xem xét, phê duyệt và quản lý tin đăng của người dùng"
      />

      <StatsCards listings={listings} />

      <ListingFiltersBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <ListingsList
        listings={filteredListings}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ListingManagement;
