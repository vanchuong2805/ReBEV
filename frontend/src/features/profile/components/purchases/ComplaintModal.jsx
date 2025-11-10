import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { createComplaint } from "@/features/profile/service"
import { useUpload } from "@/hooks/posts/useUpload"

export default function ComplaintModal({ open, onClose, purchase }) {
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { upload } = useUpload()

  // === Upload ảnh thật lên Cloudinary ===
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploading(true)

    try {
      const uploaded = []
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          alert("Vui lòng chọn file hình ảnh hợp lệ (jpg, png, jpeg...)")
          continue
        }
        const data = await upload(file)
        uploaded.push({ url: data.url.split(" ")[1] })
      }
      setImages((prev) => [...prev, ...uploaded])
      alert(" Tải ảnh lên thành công!")
    } catch (err) {
      console.error(" Lỗi khi tải ảnh lên:", err)
      alert("Không thể tải ảnh lên Cloudinary.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Vui lòng nhập mô tả khiếu nại.")
      return
    }
    setIsSubmitting(true)

    try {
      await createComplaint({
        order_detail_id: purchase.id,
        description,
        media: images,
      })
      onClose()
      setDescription("")
      setImages([])
    } catch (err) {
      console.error(" Lỗi gửi khiếu nại:", err)
      alert("Không thể gửi khiếu nại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo Yêu Cầu Hoàn Trả</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Mô tả */}
          <div>
            <Label>Mô tả chi tiết</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Sản phẩm bị trầy xước, không đúng mô tả..."
              className="mt-1"
            />
          </div>

          {/* Ảnh minh chứng */}
          <div>
            <Label>Hình ảnh minh chứng</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    alt={`uploaded-${i}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}

              <label className="w-24 h-24 flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-gray-500" />
                    <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button disabled={isSubmitting || uploading} onClick={handleSubmit}>
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
