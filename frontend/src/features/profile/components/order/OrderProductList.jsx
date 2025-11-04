import { Button } from "@/components/ui/button"
import { MessageCircle, Store } from "lucide-react"

export default function OrderProductList({ posts = [], order, navigate, type }) {
  const money = (n) => (n ? n.toLocaleString("vi-VN") + " ₫" : "0 ₫")

  return (
    <div className="p-6 bg-white border rounded shadow-sm">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <span className="font-medium text-gray-900">{posts[0]?.seller?.display_name}</span>
        <Button
          size="sm"
          className="bg-[#007BFF] hover:bg-[#0066d1] text-white ml-auto h-7 px-4"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Chat
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-4 border-[#007BFF] text-[#007BFF] hover:bg-[#E6F0FF]"
          onClick={() => navigate(`/shop/${posts[0]?.user_id || 1}`)}
        >
          <Store className="w-3 h-3 mr-1" />
          Xem Shop
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <div
            key={i}
            className="flex gap-4 border-b pb-4 last:border-none cursor-pointer"
            onClick={() => navigate(`/marketplace/listing/${post.id}`)}
          >
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1">
              <h3 className="text-sm text-gray-900">{post.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Phân loại: {post.category_id === 1 ? "Xe máy" : "Pin điện"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#007BFF] font-medium">
                {money(order.order_details?.[i]?.price)}
              </p>
              {type === "refund" && (
                <p className="text-xs text-red-500 mt-1">Hoàn tiền đang xử lý</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
