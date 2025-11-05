import { Button } from "@/components/ui/button"
import { MessageCircle, Store } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/contexts/UserContext"

export default function PurchaseHeader({ seller }) {
  const navigate = useNavigate()
  const { user } = useUser()

  if (!seller) return null

  return (
    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
      <span className="font-medium text-gray-900">
        Người bán: {seller.display_name || "Ẩn danh"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="bg-[#007BFF] hover:bg-[#0066d1] text-white h-7 px-4"
          onClick={() => navigate(`/chat?seller=${seller.id}&buyer=${user?.id}`)}
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Chat
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-7 px-4 border-[#007BFF] text-[#007BFF] hover:bg-[#E6F0FF]"
          onClick={() => navigate(`/shop/${seller.id}`)}
        >
          <Store className="w-3 h-3 mr-1" />
          Xem Shop
        </Button>
      </div>
    </div>
  )
}
