import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { fetchProvinces, fetchDistricts, fetchWards } from "@/features/profile/service"
import { useUser } from "@/contexts/UserContext"

export default function AddAddressModal({ open, onClose, onSave, contact }) {
  const { user } = useUser()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    detail: "",
    province_id: "",
    district_id: "",
    ward_code: "",
  })

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState({ provinces: false, districts: false, wards: false })
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(p => ({ ...p, provinces: true }))
      try {
        const data = await fetchProvinces()
        setProvinces(data || [])
      } catch (err) {
        console.error(" Lỗi tải tỉnh:", err)
        setError("Không tải được danh sách tỉnh.")
      } finally {
        setLoading(p => ({ ...p, provinces: false }))
      }
    }
    loadProvinces()
  }, [])


  const handleProvinceSelect = async (provinceId) => {
    setForm(prev => ({
      ...prev,
      province_id: provinceId,
      district_id: "",
      ward_code: "",
    }))
    setDistricts([])
    setWards([])

    if (!provinceId) return
    setLoading(p => ({ ...p, districts: true }))
    try {
      const data = await fetchDistricts(provinceId)
      setDistricts(data || [])
    } catch (err) {
      console.error(" Lỗi tải quận:", err)
      setError("Không tải được danh sách quận/huyện.")
    } finally {
      setLoading(p => ({ ...p, districts: false }))
    }
  }


  const handleDistrictSelect = async (districtId) => {
    setForm(prev => ({
      ...prev,
      district_id: districtId,
      ward_code: "",
    }))
    setWards([])
    if (!districtId) return
    setLoading(p => ({ ...p, wards: true }))
    try {
      const data = await fetchWards(districtId)
      setWards(data || [])
    } catch (err) {
      console.error(" Lỗi tải phường:", err)
      setError("Không tải được danh sách phường/xã.")
    } finally {
      setLoading(p => ({ ...p, wards: false }))
    }
  }


  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name || "",
        phone: contact.phone || "",
        detail: contact.detail || "",
        province_id: contact.province_id || "",
        district_id: contact.district_id || "",
        ward_code: contact.ward_code || "",
      })

      if (contact.province_id) handleProvinceSelect(contact.province_id)
      if (contact.district_id) handleDistrictSelect(contact.district_id)
    } else if (open) {

      setForm({
        name: "",
        phone: "",
        detail: "",
        province_id: "",
        district_id: "",
        ward_code: "",
      })
      setDistricts([])
      setWards([])
    }
  }, [contact, open])


  const handleSubmit = () => {

    const phoneRegex = /^(0|\+84)(\d{9})$/

    if (!form.name.trim()) {
      alert("Vui lòng nhập họ và tên.")
      return
    }

    if (!form.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.")
      return
    }

    if (!phoneRegex.test(form.phone.trim())) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập số 10 chữ số (VD: 0896402450 hoặc +84896402450).")
      return
    }

    if (!form.detail.trim()) {
      alert("Vui lòng nhập địa chỉ chi tiết (số nhà, tên đường...).")
      return
    }

    if (!form.province_id) {
      alert("Vui lòng chọn Tỉnh/Thành phố.")
      return
    }

    if (!form.district_id) {
      alert("Vui lòng chọn Quận/Huyện.")
      return
    }

    if (!form.ward_code) {
      alert("Vui lòng chọn Phường/Xã.")
      return
    }

    const province = provinces.find(p => p.ProvinceID == form.province_id)
    const district = districts.find(d => d.DistrictID == form.district_id)
    const ward = wards.find(w => w.WardCode == form.ward_code)

    const payload = {
      user_id: user?.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      detail: form.detail.trim(),
      province_id: province?.ProvinceID || "",
      province_name: province?.ProvinceName || "",
      district_id: district?.DistrictID || "",
      district_name: district?.DistrictName || "",
      ward_code: ward?.WardCode || "",
      ward_name: ward?.WardName || "",
    }

    onSave(payload)
  }


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="add-address-desc">
        <p id="add-address-desc" className="sr-only">
          Form nhập thông tin địa chỉ người nhận
        </p>


        <DialogHeader>
          <DialogTitle>{contact ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 p-2 text-sm rounded-md mb-3">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Input
            placeholder="Họ và tên"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            placeholder="Số nhà, tên đường..."
            value={form.detail}
            onChange={e => setForm({ ...form, detail: e.target.value })}
          />

          {/* ===== Province ===== */}
          <div className="space-y-1">
            <Label>Tỉnh / Thành phố</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.province_id
                    ? provinces.find(p => p.ProvinceID == form.province_id)?.ProvinceName
                    : loading.provinces
                      ? "Đang tải..."
                      : "Chọn tỉnh / thành phố"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto rounded-lg shadow-xl"
              >
                {provinces.map(p => (
                  <DropdownMenuItem
                    key={p.ProvinceID}
                    onClick={() => handleProvinceSelect(p.ProvinceID)}
                  >
                    {p.ProvinceName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ===== District ===== */}
          <div className="space-y-1">
            <Label>Quận / Huyện</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!form.province_id || loading.districts}
                >
                  {form.district_id
                    ? districts.find(d => d.DistrictID == form.district_id)?.DistrictName
                    : !form.province_id
                      ? "Chọn tỉnh trước"
                      : loading.districts
                        ? "Đang tải..."
                        : "Chọn quận / huyện"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto rounded-lg shadow-xl"
              >
                {districts.map(d => (
                  <DropdownMenuItem
                    key={d.DistrictID}
                    onClick={() => handleDistrictSelect(d.DistrictID)}
                  >
                    {d.DistrictName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ===== Ward ===== */}
          <div className="space-y-1">
            <Label>Phường / Xã</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!form.district_id || loading.wards}
                >
                  {form.ward_code
                    ? wards.find(w => w.WardCode == form.ward_code)?.WardName
                    : !form.district_id
                      ? "Chọn quận trước"
                      : loading.wards
                        ? "Đang tải..."
                        : "Chọn phường / xã"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-50 overflow-y-auto rounded-lg shadow-xl"
              >
                {wards.map(w => (
                  <DropdownMenuItem
                    key={w.WardCode}
                    onClick={() => setForm({ ...form, ward_code: w.WardCode })}
                  >
                    {w.WardName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm"
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
