import { useState, useEffect } from "react";
import TitlePage from "../components/TitlePage";
import ListingsList from "../components/ListingComponents/ListingsList";
import Pagination from "../components/ListingComponents/Pagination";
import FilterBar from "../components/FilterBar";
import ListingDetailsModal from "../components/ListingComponents/ListingDetailsModal";
import { fetchPost, updatePostStatus } from "../service";
import { toast } from "sonner";

const ListingManagement = () => {
  // filSearch là object dùng để build query cho fetch
  const [filSearch, setFilSearch] = useState({
    searchTerm: "",
    status: "",
    category: "",
    page: 1,
  });

  // Modal state
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 1,
    currentPage: 1,
  });
  // build searchKey dựa trên filSearch
  const searchKey =
    "?status=" +
    filSearch.status +
    "&category_id=" +
    filSearch.category +
    "&search=" +
    encodeURIComponent(filSearch.searchTerm || "") +
    `&page=${filSearch.page}&limit=5`;

  // Khi filSearch thay đổi -> fetch
  useEffect(() => {
    let mounted = true;
    fetchPost(searchKey)
      .then((data) => {
        if (!mounted) return;
        // đảm bảo status là number
        const normalized = (data.data || []).map((p) => ({
          ...p,
          status: Number(p.status),
        }));
        setPosts(normalized);
        setPagination(data.pagination || { totalPages: 1, currentPage: 1 });
      })
      .catch((err) => {
        console.error("Fetch posts error:", err);
        setPosts([]);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filSearch]); // chỉ fetch khi filSearch thay đổi

  // Nếu bạn muốn cập nhật filSearch khi user chỉnh searchTerm/statusFilter/categoryFilter
  // (ví dụ FilterBar dùng onchange để cập nhật trạng thái UI nhưng sẽ gọi setFilSearch khi ấn nút Tìm kiếm)
  // Ở đây mình đặt effect để tự động đồng bộ nếu bạn muốn:

  const refreshPost = async () => {
    try {
      const fresh = await fetchPost();
      setPosts((fresh || []).map((p) => ({ ...p, status: Number(p.status) })));
    } catch (err) {
      console.error("Refresh posts failed:", err);
    }
  };

  // Handlers
  const handleApprove = async (id) => {
    try {
      console.log("Token hiện tại:", localStorage.getItem("token"));
      await updatePostStatus(id, 1);
      await refreshPost();
      toast.success(`Đã phê duyệt tin đăng: ${id}`);
      // nếu modal đang mở và chính là bài này thì cập nhật modal state
      if (selected?.id === id) {
        setSelected((s) => s && { ...s, status: 1 });
      }
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
      if (selected?.id === id) {
        setSelected((s) => s && { ...s, status: 2 });
      }
    } catch (err) {
      toast.error(`Lỗi khi từ chối tin đăng: ${err.message}`);
    }
  };

  // mở modal: nhận listing object hoặc id
  const handleViewDetails = (listingOrId) => {
    if (!listingOrId) return;
    // nếu là object -> gán trực tiếp
    if (typeof listingOrId === "object") {
      setSelected(listingOrId);
      setModalOpen(true);
      return;
    }
    // nếu là id -> tìm trong posts, nếu không có thì có thể fetch chi tiết từ server
    const found = posts.find((p) => String(p.id) === String(listingOrId));
    if (found) {
      setSelected(found);
      setModalOpen(true);
    } else {
      // fallback: fetch detail từ API nếu bạn có endpoint
      console.log("Viewing listing details (id):", listingOrId);
      // ví dụ: fetchPostDetail(listingOrId).then(d => { setSelected(d); setModalOpen(true) })
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div className="p-6">
      <TitlePage
        title="Quản lý tin đăng"
        description="Xem xét, phê duyệt và quản lý tin đăng của người dùng"
      />

      <FilterBar
        setFilSearch={setFilSearch}
        searchPlaceholder="Tìm kiếm tiêu đề ..."
        selects={[
          {
            key: "status",
            value: filSearch.status,
            onChange: (v) => setFilSearch((pre) => ({ ...pre, status: v })),
            options: [
              { value: "", label: "Tất cả trạng thái" },
              { value: 0, label: "Chờ duyệt" },
              { value: 1, label: "Đã duyệt" },
              { value: 2, label: "Từ chối" },
              { value: 3, label: "Đã bán" },
              { value: 5, label: "Đã hủy" },
              { value: 6, label: "Đã xác nhận" },
              { value: 7, label: "Đang giao dịch" },
            ],
          },
          {
            key: "category",
            value: filSearch.category,
            onChange: (v) => setFilSearch((pre) => ({ ...pre, category: v })),
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
      />

      {/* Pagination */}
      <Pagination
        length={Number(pagination.total) / 5}
        current={filSearch.page}
        canPrev={filSearch.page > 1}
        canNext={posts.length === 5} // nếu đủ limit => còn trang sau
        onChange={(p) => setFilSearch((pre) => ({ ...pre, page: p }))}
      />

      <ListingDetailsModal
        open={modalOpen}
        listing={selected}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ListingManagement;
