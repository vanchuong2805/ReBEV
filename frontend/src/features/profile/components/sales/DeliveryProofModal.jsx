import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { useUpload } from "@/hooks/posts/useUpload"
import { toast } from "sonner"

export default function DeliveryProofModal({ open, order, onClose, onSubmit }) {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { upload } = useUpload()

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    try {
      const uploaded = []
      for (const f of files) {
        if (!f.type.startsWith("image/")) {
          toast.error("Chỉ được chọn ảnh!")
          continue
        }
        const data = await upload(f)
        uploaded.push({ url: data.url.split(" ")[1] })
      }
      setImages((prev) => [...prev, ...uploaded])
    } catch (err) {
      console.error(err)
      toast.error("Lỗi upload ảnh.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (images.length === 0) {
      return toast.error("Bạn cần tải lên ít nhất 1 ảnh minh chứng!")
    }

    setIsSubmitting(true)

    await onSubmit({
      orderId: order.id,
      media: images,
    })

    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Xác nhận đã giao hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload ảnh */}
          <div>
            <Label>Ảnh chứng minh (bắt buộc)</Label>

            <div className="mt-2 flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    className="w-24 h-24 object-cover border rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setImages((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Button upload */}
              <label className="w-24 h-24 border border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50">
                {uploading ? (
                  <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-gray-500" />
                    <span className="text-xs text-gray-500">Thêm ảnh</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button disabled={isSubmitting || uploading} onClick={handleSubmit}>
            {isSubmitting ? "Đang gửi..." : "Xác nhận giao hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
