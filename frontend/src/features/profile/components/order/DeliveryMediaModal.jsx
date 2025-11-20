import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"

export default function DeliveryMediaModal({ open, onClose, mediaString }) {
  const [media, setMedia] = useState([])

  useEffect(() => {
    if (!mediaString) {
      setMedia([])
      return
    }

    try {
      // mediaString có thể là JSON.stringify, hoặc mảng object thật
      let parsed = mediaString

      // nếu là string JSON thì parse
      if (typeof mediaString === "string") {
        parsed = JSON.parse(mediaString)
      }

      // đảm bảo là array
      if (Array.isArray(parsed)) {
        setMedia(parsed)
      } else {
        setMedia([])
      }

    } catch (err) {
      console.error("Lỗi parse media:", err)
      setMedia([])
    }
  }, [mediaString])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ảnh bàn giao</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {media.length === 0 ? (
            <p className="text-gray-500 italic col-span-2 text-center">
              Không có ảnh bàn giao
            </p>
          ) : (
            media.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="delivery"
                className="w-full h-32 object-cover rounded-lg border"
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
