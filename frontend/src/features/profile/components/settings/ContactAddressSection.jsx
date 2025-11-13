import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, CheckCircle } from "lucide-react"
import AddAddressModal from "./AddAddressModal"
import { useUser } from "@/contexts/UserContext"
import {
  getContactByUserId,
  deleteContact,
  setDefaultContact
} from "@/features/profile/service"
import { toast } from "sonner"

export default function ContactAddressSection() {
  const { user, loading } = useUser()
  const [contacts, setContacts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const loadContact = async () => {
    if (!user?.id) return
    try {
      const data = await getContactByUserId(user.id)
      const activeContacts = Array.isArray(data)
        ? data.filter((c) => !c.is_deleted)
        : []
      setContacts(activeContacts)
    } catch (err) {
      console.error("Lỗi tải contact:", err)
      setContacts([])
    }
  }

  useEffect(() => {
    loadContact()
  }, [user])

  const handleSetDefault = async (id) => {
    try {
      await setDefaultContact(id)

    
      setContacts((prev) =>
        prev.map((c) => ({
          ...c,
          is_default: c.id === id
        }))
      )

      toast.success("Đã đặt làm địa chỉ mặc định!")
    } catch (err) {
      console.error("Lỗi đặt mặc định:", err)
      toast.error("Không thể đặt mặc định, vui lòng thử lại.")
    }
  }

  const handleAdd = () => {
    setEditing(null)
    setShowModal(true)
  }

  const handleEdit = (contact) => {
    setEditing(contact)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này không?")) return

    try {
      await deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
      toast.success("Đã xoá địa chỉ thành công!")
    } catch (err) {
      console.error("Lỗi xoá contact:", err)
      toast.error("Xoá thất bại, vui lòng thử lại.")
    }
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
    <div className="space-y-4">
      {/* Không có địa chỉ */}
      {contacts.length === 0 ? (
        <p className="py-4 text-center text-gray-500">
          Bạn chưa có địa chỉ nào. Hãy thêm mới bên dưới.
        </p>
      ) : (
        contacts.map((c) => (
          <Card key={c.id} className="flex items-start justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-600">{c.phone}</p>
              <p className="mt-1 text-sm text-gray-700">{c.detail}</p>
              <p className="text-sm text-gray-500">
                {[c.ward_name, c.district_name, c.province_name]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {c.is_default ? (
                <span className="inline-flex items-center mt-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" /> Mặc định
                </span>
              ) : (
                <Button
                  variant="link"
                  className="p-0 mt-1 text-sm text-blue-600"
                  onClick={() => handleSetDefault(c.id)}
                >
                  Đặt làm mặc định
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(c)}>
                <Pencil className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(c.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))
      )}

      {/* Nút thêm mới */}
      <Button
        className="w-full mt-2 bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm"
        onClick={handleAdd}
      >
        + Thêm địa chỉ mới
      </Button>

      {/* Modal Add/Edit */}
      <AddAddressModal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          loadContact()
        }}
        contact={editing}
      />
    </div>
  )
}
