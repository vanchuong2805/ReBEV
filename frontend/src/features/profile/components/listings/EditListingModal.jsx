import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getPostById, updatePostById } from "@/features/profile/service"

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
      }

      await updatePostById(listing.id, updatedData)

      onUpdate({ ...listing, ...updatedData })

      alert(" Cập nhật bài viết thành công!")
      onClose()
    } catch (error) {
      console.error(" Lỗi khi cập nhật bài viết:", error)
      alert("Cập nhật thất bại! Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <p className="text-gray-500 text-center py-4">Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label>Tiêu đề</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div>
                <Label>Mô tả</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                />
              </div>

              <div>
                <Label>Giá (VNĐ)</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Huỷ
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
