import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, CheckCircle } from "lucide-react"
import AddAddressModal from "./AddAddressModal"
import { useUser } from "@/contexts/UserContext"
import { getContactByUserId, createContact, deleteContact, updateContact } from "@/features/profile/service"

export default function ContactAddressSection() {
  const { user, loading } = useUser()
  const [contacts, setContacts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (!user) return
    const loadContact = async () => {
      try {
        const data = await getContactByUserId(user.id)
        const activeContacts = Array.isArray(data)
          ? data.filter(contact => !contact.is_deleted)
          : []
        setContacts(activeContacts)
      } catch (err) {
        console.error(" Lỗi tải contact:", err)
        setContacts([])
      }
    }
    loadContact()
  }, [user])

  const setDefault = (id) => {
    setContacts((prev) =>
      prev.map((c) => ({ ...c, is_default: c.id === id ? 1 : 0 }))
    )
  }

  const handleAdd = () => {
    setEditing(null)
    setShowModal(true)
  }

  const handleEdit = (contact) => {
    setEditing(contact)
    setShowModal(true)
  }


  const handleSave = async (formData) => {
    try {
      if (editing) {
        const payload = { ...formData, user_id: user.id }
        const res = await updateContact(editing.id, payload)
        setContacts((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...formData } : c))
        )
      } else {
        const payload = { ...formData, user_id: user.id }
        const res = await createContact(payload)
        console.log(" Kết quả API create:", res)
        setContacts((prev) => [...prev, res.contact])
      }
      setShowModal(false)
    } catch (err) {
      console.error(" Lỗi khi lưu contact:", err)
      alert("Thêm địa chỉ thất bại, vui lòng thử lại.")
    }
  }


  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này không?")) return
    try {
      await deleteContact(id)
      console.log(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
      alert("Đã xoá địa chỉ thành công!")
    } catch (err) {
      console.error(" Lỗi khi xoá contact:", err)
      alert("Xoá thất bại, vui lòng thử lại.")
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
      {contacts?.length === 0 ? (
        <p className="py-4 text-center text-gray-500">
          Bạn chưa có địa chỉ nào. Hãy thêm mới bên dưới.
        </p>
      ) : (
        contacts?.map((c) => (
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
                  onClick={() => setDefault(c.id)}
                >
                  Đặt làm mặc định
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(c)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDelete(c.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))
      )}

      <Button
        className="w-full mt-2 bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm"
        onClick={handleAdd}
      >
        + Thêm địa chỉ mới
      </Button>

      <AddAddressModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(payload) => handleSave(payload)}
        contact={editing}
      />
    </div>
  )
}
