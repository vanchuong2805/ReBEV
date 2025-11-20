// pages/SystemFee.jsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { getCategory, updateCategory } from "../../service";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

export default function SystemFee() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [percentInput, setPercentInput] = useState("");
  const [saving, setSaving] = useState(false);

  const user = useUser().user;

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategory();
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const onOpenEdit = (category) => {
    setEditingId(category.id);
    const current = category.is_deposit
      ? category.deposit_rate
      : category.commission_rate;
    setPercentInput(String(current ?? 0));
  };

  const onCancel = () => {
    setEditingId(null);
    setPercentInput("");
  };

  const onSave = async (category) => {
    const num = Number(percentInput);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      toast.error("Phần trăm phải trong khoảng 0–100.");
      return;
    }
    try {
      setSaving(true);
      await updateCategory(category.id, num);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? category.is_deposit
              ? { ...c, deposit_rate: num }
              : { ...c, commission_rate: num }
            : c
        )
      );
      toast.success("Đã cập nhật phần trăm");
      onCancel();
    } catch (e) {
      toast.error("Cập nhật thất bại " + (e?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {user?.role == 2 && (
        <div className="mt-6 space-y-6">
          {categories.map((category) => {
            const label = category.is_deposit ? "Phí đặt cọc" : "Phí hoa hồng";
            const currentPercent = category.is_deposit
              ? category.deposit_rate
              : category.commission_rate;
            const isEditing = editingId === category.id;

            return (
              <Card
                key={category.id}
                className="m-6 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm">
                      {category.is_deposit ? (
                        <span className="font-medium text-emerald-600">
                          Có đặt cọc
                        </span>
                      ) : (
                        <span className="font-medium text-rose-600"></span>
                      )}
                    </p>

                    <div className="mt-2">
                      <span className="text-sm text-slate-500">{label}: </span>
                      {!isEditing ? (
                        <span className="text-2xl font-semibold text-blue-600">
                          {currentPercent}%
                        </span>
                      ) : (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="flex items-center rounded-xl border border-slate-300 bg-white px-2 py-1.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={percentInput}
                              onChange={(e) => setPercentInput(e.target.value)}
                              className="w-24 text-right text-2xl font-semibold text-blue-700 outline-none"
                            />
                            <span className="ml-1 text-2xl font-semibold text-blue-700">
                              %
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onSave(category)}
                            disabled={saving}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {saving ? "Đang lưu..." : "Lưu"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-300"
                            onClick={onCancel}
                            disabled={saving}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Hủy
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-slate-300 hover:bg-slate-50"
                      onClick={() => onOpenEdit(category)}
                    >
                      <Pencil size={16} className="mr-1" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
