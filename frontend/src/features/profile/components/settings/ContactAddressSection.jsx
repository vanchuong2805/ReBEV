import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, CheckCircle } from "lucide-react"
import AddAddressModal from "./AddAddressModal"

const mockContacts = [
    {
        id: 1,
        user_id: 1,
        name: "Nguyễn Thị Tú Anh",
        phone: "0901234567",
        detail: "12 Nguyễn Văn Bảo",
        ward: "Phường 4",
        province: "TP Hồ Chí Minh",
        is_default: 1,
    },
    {
        id: 2,
        user_id: 1,
        name: "Tú Anh - Văn phòng",
        phone: "0912345678",
        detail: "99 Võ Thị Sáu",
        ward: "Phường 6",
        province: "TP Hồ Chí Minh",
        is_default: 0,
    },
]

export default function ContactAddressSection() {
    const [contacts, setContacts] = useState(mockContacts)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null) // 💡 null = thêm mới, object = sửa

    const setDefault = id =>
        setContacts(contacts.map(c => ({ ...c, is_default: c.id === id ? 1 : 0 })))

    // ✅ Mở modal thêm mới
    const handleAdd = () => {
        setEditing(null)
        setShowModal(true)
    }

    // ✅ Mở modal sửa
    const handleEdit = (contact) => {
        setEditing(contact)
        setShowModal(true)
    }

    // ✅ Lưu (thêm hoặc cập nhật)
    const handleSave = (newData) => {
        if (editing) {
            // Cập nhật
            setContacts(contacts.map(c => (c.id === editing.id ? { ...c, ...newData } : c)))
        } else {
            // Thêm mới
            const newId = Math.max(...contacts.map(c => c.id)) + 1
            setContacts([...contacts, { id: newId, ...newData, is_default: 0 }])
        }
        setShowModal(false)
    }

    return (
        <div className="space-y-4">
            {contacts.map(c => (
                <Card key={c.id} className="p-4 flex justify-between items-start">
                    <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.phone}</p>
                        <p className="text-sm text-gray-700 mt-1">{c.detail}</p>
                        <p className="text-sm text-gray-500">{c.ward}</p>
                        <p className="text-sm text-gray-500">{c.province}</p>
                        {c.is_default ? (
                            <span className="inline-flex items-center mt-1 text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" /> Mặc định
                            </span>
                        ) : (
                            <Button
                                variant="link"
                                className="text-blue-600 text-sm p-0 mt-1"
                                onClick={() => setDefault(c.id)}
                            >
                                Đặt làm mặc định
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(c)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </Card>
            ))}

            <Button className="w-full mt-2 bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm" onClick={handleAdd}>
                + Thêm địa chỉ mới
            </Button>

            <AddAddressModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                contact={editing}
            />
        </div>
    )
}
