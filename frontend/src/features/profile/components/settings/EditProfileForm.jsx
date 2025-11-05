import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { updateProfile } from "@/features/profile/service"
import { useUpload } from "@/hooks/posts/useUpload"   

export default function EditProfileForm() {
  const { user, loading, updateUser } = useUser()
  const { upload } = useUpload() // 🔹 dùng custom hook
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    avatar: "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg",
    display_name: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    if (user) {
      setForm({
        avatar: user.avatar || "https://res.cloudinary.com/du261e4fa/image/upload/v1762304930/avatar-trang-4_auzkk9.jpg",
        display_name: user.display_name || "",
        phone: user.phone || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // === UPLOAD ẢNH LÊN CLOUDINARY ===
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh hợp lệ (jpg, png, jpeg...)")
      return
    }

    try {
      setUploading(true)
      const data = await upload(file) // 🔹 upload thật lên Cloudinary
      setForm({ ...form, avatar: data.url.split(" ")[1] }) // chỉ lấy phần URL
      alert("Tải ảnh lên thành công!")
    } catch (err) {
      console.error(err)
      alert("Lỗi khi tải ảnh lên Cloudinary")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedUser = {
      ...user,
      avatar: form.avatar,
      display_name: form.display_name,
      update_at: new Date().toISOString(),
    }
    console.log("📤 Gửi updateProfile:", user.id, updatedUser )
    await updateProfile(user.id, updatedUser)
    updateUser(updatedUser)
    alert("Cập nhật thông tin thành công!")
  }

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-gray-500">
          Đang tải thông tin...
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20">
          <img
            src={form.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById("avatarUpload").click()}
          >
            {uploading ? "Đang tải lên..." : "Đổi ảnh đại diện"}
          </Button>
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Display name */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
        <Input
          name="display_name"
          value={form.display_name}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={form.email}
          disabled
          className="bg-white text-black cursor-not-allowed border border-gray-300"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <Input
          name="phone"
          value={form.phone}
          disabled
          className="bg-white text-black text-sm font-medium cursor-not-allowed border border-gray-300"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm"
      >
        Lưu thay đổi
      </Button>
    </form>
  )
}
