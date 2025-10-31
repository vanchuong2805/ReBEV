import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { createReview } from "@/features/profile/service"

export default function ReviewModal({ open, onClose, purchase, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
   
    const { user } = useUser()

    const handleSubmit = async () => {
    if (rating === 0) return alert("Vui lòng chọn số sao trước khi gửi đánh giá!")

    try {
      const res = await createReview(user.id, purchase.id, rating, comment)
      console.log("✅ Review đã gửi:", res)
      alert("Cảm ơn bạn đã đánh giá!")
      setRating(0)
      setComment("")
      onClose()
    } catch (error) {
      console.error("❌ Lỗi gửi đánh giá:", error)
      alert("Gửi đánh giá thất bại!")
    }
  }


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Đánh giá giao dịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-7 h-7 cursor-pointer transition ${
                  star <= (hover || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          {/* Comment */}
          <Textarea
            placeholder="Hãy chia sẻ cảm nhận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] text-gray-700"
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
