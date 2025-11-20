import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getPostById, updatePostById } from "@/features/profile/service"
import TiptapEditor from "@/components/common/TiptapEditor"
import { toast } from "sonner"

export default function EditListingModal({ open, onClose, listing, onUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      if (!listing?.id) return
      try {
        setLoadingData(true)
        const data = await getPostById(listing.id)
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || 0,
        })
      } catch (error) {
        console.error(" Lỗi khi tải bài viết:", error)
      } finally {
        setLoadingData(false)
      }
    }
    if (open) fetchPost()
  }, [open, listing])


  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))


  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết!")
      return
    }
    if (formData.price < 50000) {
      toast.error("Giá phải lớn hơn hoặc bằng 50.000₫!")
      return
    }

    try {
      setLoading(true)
      const updatedData = {
        title: formData.title.trim(),
        description: formData.description,
        price: Number(formData.price),
      }

      await updatePostById(listing.id, updatedData)
      onUpdate({ ...listing, ...updatedData })
      toast.success(" Cập nhật bài viết thành công!")
      onClose()
    } catch (error) {
      console.error(" Lỗi khi cập nhật bài viết:", error)
      toast.error("Cập nhật thất bại! Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-2xl shadow-md border border-gray-200 p-6 bg-white">
        {/* Header */}
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Chỉnh sửa bài viết
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Cập nhật thông tin bài đăng của bạn bên dưới.
          </p>
        </DialogHeader>

        {/* Nội dung */}
        {loadingData ? (
          <div className="py-12 text-center text-gray-500 animate-pulse">
            Đang tải dữ liệu bài viết...
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Tiêu đề */}
              <div>
                <Label className="text-gray-700 font-medium">Tiêu đề</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="mt-2 h-11 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div className="pt-2">
                <Label className="text-gray-700 font-medium mb-2 block">
                  Mô tả chi tiết
                </Label>

                <div
                  className="rounded-xl border bg-gray-50 overflow-y-auto"
                  style={{
                    maxHeight: "300px", 
                  }}
                >
                  <TiptapEditor
                    content={formData.description}
                    onChange={(value) => handleChange("description", value)}
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>
              </div>


              {/* Giá */}
              <div>
                <Label className="text-gray-700 font-medium">Giá (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  min="50000"
                  className="mt-2 h-11 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Giá tối thiểu: 50.000₫
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 border-t pt-5">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-11 px-6 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Huỷ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="h-11 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
