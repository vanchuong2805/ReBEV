import { ShoppingCart, CreditCard, MessageCircle, Heart } from "lucide-react";
import { addCarts } from "../service";
import { useFavorite } from "@/contexts/FavoritesContexts.jsx";
import { useCart } from "@/contexts/CartContext";

export default function ListingActions({
  listing,
  seller,
  user,
  categoryInfo,
  handleBuyNow,
  handleHidePost,
  navigate,
}) {
  const { favoriteList, toggleFavorite } = useFavorite();
  const isFav = favoriteList.some((f) => f.id === listing.id);
  const { addToCart } = useCart();
  const handleAddToCart = async () => {
    if (!user) {
      alert(" Bạn cần đăng nhập để thêm vào giỏ hàng");
      return;
    }
    console.log(user, listing.id);
    try {
      await addToCart(user.id, listing.id);
      alert(`🛒 Đã thêm "${listing.title}" vào giỏ hàng thành công!`);
    } catch (error) {
      console.error(" Lỗi khi thêm vào giỏ hàng:", error);
      alert(" Thêm vào giỏ hàng thất bại. Vui lòng thử lại sau.");
    }
  };

  // === CHỦ BÀI ĐĂNG ===
  if (seller?.id === user?.id) {
    return (
      <button
        onClick={() => {
          handleHidePost(listing.id);
          alert(
            listing.is_hidden ? "Tin đã được hiển thị lại" : "Tin đã được ẩn"
          );
        }}
        className={`w-full px-4 py-3 mb-3 font-semibold text-white rounded-xl shadow-md transition 
        ${
          listing.is_hidden
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        {listing.is_hidden ? "Hiện tin" : "Ẩn tin"}
      </button>
    );
  }

  // === NGƯỜI DÙNG THƯỜNG ===
  return (
    <div className="flex flex-col gap-3">
      {/* MUA NGAY */}
      <button
        onClick={() => handleBuyNow()}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold text-white rounded-xl 
                   bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                   shadow-md transition-transform hover:scale-[1.02]"
      >
        <CreditCard className="w-5 h-5" />
        {categoryInfo?.id === 1 ? "Đặt cọc ngay" : "Mua ngay"}
      </button>

      {/* THÊM VÀO GIỎ */}
      {listing.category_id !== 1 && (
        <button
          onClick={() => handleAddToCart(listing.id)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold text-white rounded-xl 
                     bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 
                     shadow-md transition-transform hover:scale-[1.02]"
        >
          <ShoppingCart className="w-5 h-5" />
          Thêm vào giỏ hàng
        </button>
      )}

      {/* NHẮN TIN */}
      <button
        onClick={() =>
          navigate(`/chat?buyer=${user.id}&seller=${listing.user_id}`)
        }
        className="flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-md transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="w-5 h-5" />
        Nhắn tin
      </button>

      {/* YÊU THÍCH */}
      <button
        onClick={() => toggleFavorite(listing.id)}
        className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold rounded-xl border shadow-sm transition-all duration-200 
        ${
          isFav
            ? "bg-gradient-to-r from-pink-50 to-rose-100 border-pink-300 text-pink-600 hover:from-pink-100 hover:to-rose-200"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-transform ${
            isFav ? "fill-pink-500 text-pink-500 scale-110" : "text-gray-500"
          }`}
        />
        {isFav ? "Đã yêu thích" : "Yêu thích"}
      </button>
    </div>
  );
}
