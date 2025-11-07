import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "../service";
import CheckoutBar from "../components/CheckoutBar";
import Header from "@/components/common/Header";
import { toast } from "sonner";

// import & xài AddAddressModal
import AddAddressModal from "@/features/profile/components/settings/AddAddressModal";
import { getContactByUserId, deleteContact } from "@/features/profile/service";

// shadcn ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GroupCheckout from "../components/GroupCheckout";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedTotal, selectedGroups } = useCart();
  const [paymentGroup, setPaymentGroup] = useState({});
  const [loading, setLoading] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [addressOpen, setAddressOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  // Chặn truy cập trực tiếp nếu chưa chọn sản phẩm
  useEffect(() => {
    if (!selectedGroups || selectedGroups.length === 0 || selectedTotal === 0) {
      toast.error("Vui lòng chọn sản phẩm trước khi thanh toán");
      navigate("/", { replace: true });
    }
  }, [selectedGroups, selectedTotal, navigate]);

  useEffect(() => {
    const totalDeliveryFee = Object.values(paymentGroup).reduce(
      (acc, curr) => acc + curr.delivery_price,
      0
    );
    console.log(totalDeliveryFee);
    setShippingFee(totalDeliveryFee);
  }, [paymentGroup]);

  // lấy user id
  const userRaw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    if (!contacts.length) return;

    if (!selectedContact) {
      setSelectedContact(contacts[0]);
      return;
    }

    const stillExists = contacts.some((c) => c.id === selectedContact.id);
    if (!stillExists) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  // mở modal -> load contact từ DB
  useEffect(() => {
    if (!addressOpen || !user?.id) return;
    (async () => {
      try {
        setContactsLoading(true);
        const data = await getContactByUserId(user.id);
        const list = Array.isArray(data)
          ? data.filter((c) => !c.is_deleted)
          : [];
        setContacts(list);
        if (list.length > 0) {
          setSelectedContact(list[0]);
        }
        console.log("abcxyz");
      } catch (e) {
        console.error("Load contacts failed:", e);
        setContacts([]);
      } finally {
        setContactsLoading(false);
      }
    })();
  }, [loading, user?.id, addressOpen]);

  const placeOrder = async () => {
    // selectedGroups, selectedContact, paymentGroup
    const paymentInfo = {
      total_amount: selectedTotal + shippingFee,
      redirectUrl: `${window.location.origin}`,
    };

    const orders = selectedGroups.map((group) => {
      const key = `${group.seller_id}_${group.seller_contact.id}`;
      const weight = paymentGroup[key]?.weight || 0;
      const delivery_price = paymentGroup[key]?.delivery_price || 0;
      const appointment_time = paymentGroup[key]?.appointment_time || "";
      const total_amount = paymentGroup[key]?.total_amount || 0;
      const order_details = group.items.map((item) => ({
        post_id: item.post_id,
        price: item.price,
        deposit_amount: item.price * item.deposit_rate,
        commission_amount: item.commission_rate * item.price,
        appointment_time,
      }));
      return {
        seller_id: group.seller_id,
        order_type: 1,
        from_contact_id: group.seller_contact.id,
        to_contact_id: selectedContact.id,
        weight,
        delivery_price,
        total_amount,
        order_details,
      };
    });
    const orderData = { orders, paymentInfo };
    console.log(orderData);
    const { payUrl } = await createOrder(orderData);
    console.log(payUrl);
    window.location.href = payUrl;
  };

  // ==== handlers cho modal danh sách địa chỉ ====
  const addNew = () => {
    setEditing(null);
    setShowAdd(true);
  };

  const editOne = (contact) => {
    setEditing(contact);
    setShowAdd(true);
  };

  const saveAddress = async (payload) => {
    try {
      setShowAdd(false);
      setEditing(null);
      if (!user?.id) return;
      setContactsLoading(true);
      const data = await getContactByUserId(user.id);
      const list = Array.isArray(data) ? data.filter((c) => !c.is_deleted) : [];
      setContacts(list);
      const maybe = list.find(
        (c) =>
          (payload?.id && c.id === payload.id) ||
          (c.phone === payload?.phone && c.detail === payload?.detail)
      );
      setSelectedContact(maybe || list[0] || null);
    } catch (e) {
      console.error("saveAddress reload failed:", e);
    } finally {
      setContactsLoading(false);
    }
  };

  const removeOne = async (id) => {
    if (!confirm("Bạn có chắc muốn xoá địa chỉ này không?")) return;
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error("deleteContact failed:", e);
      alert("Xoá thất bại, vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="grid w-11/12 max-w-6xl gap-6 p-6 mx-auto md:w-4/5">
        {/* ======= ĐỊA CHỈ NHẬN HÀNG ======= */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Địa chỉ nhận hàng</h2>
              {selectedContact || contacts[0] ? (
                <div className="mt-1 text-sm text-gray-700">
                  <div className="font-medium">
                    {(selectedContact || contacts[0]).name} •{" "}
                    {(selectedContact || contacts[0]).phone}
                  </div>
                  <div>
                    {(selectedContact || contacts[0]).detail}
                    {", "}
                    {[
                      (selectedContact || contacts[0]).ward_name,
                      (selectedContact || contacts[0]).district_name,
                      (selectedContact || contacts[0]).province_name,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Bạn chưa chọn địa chỉ. Vui lòng chọn để giao hàng chính xác.
                </p>
              )}
            </div>
            <button
              onClick={() => setAddressOpen(true)}
              className="text-blue-600 hover:underline"
            >
              {selectedContact || contacts[0] ? "Thay đổi" : "Chọn địa chỉ"}
            </button>
          </div>
        </div>

        {/* ======= DANH SÁCH SẢN PHẨM ======= */}
        <div>
          <h1 className="text-xl font-semibold">Thanh toán</h1>
          <div className="bg-white divide-y rounded-lg shadow-sm">
            {console.log(selectedGroups)}
            {selectedGroups.map((group) => (
              <GroupCheckout
                key={group.seller_id}
                groupItems={group}
                customerContact={selectedContact}
                setPaymentGroup={setPaymentGroup}
                paymentGroup={paymentGroup}
              />
            ))}
          </div>
        </div>

        {/* ======= TỔNG KẾT ======= */}
        <div>
          <CheckoutBar
            subtotal={selectedTotal}
            shipping={shippingFee}
            onPlaceOrder={placeOrder}
            loading={loading}
            customerContact={selectedContact}
            groupItems={selectedGroups}
            paymentGroup={paymentGroup}
          />
        </div>
      </div>

      {/* ======= MODAL CHỌN ĐỊA CHỈ (click card để chọn) ======= */}
      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ nhận hàng</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-3">
            <Button variant="outline" onClick={addNew}>
              + Thêm địa chỉ
            </Button>
          </div>

          <div className="max-h-[65vh] overflow-auto space-y-3">
            {contactsLoading ? (
              <div className="py-8 text-center text-gray-500">Đang tải…</div>
            ) : contacts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Chưa có địa chỉ. Nhấn “Thêm địa chỉ”.
              </div>
            ) : (
              contacts.map((c) => {
                const active =
                  (selectedContact?.id ?? contacts[0]?.id) === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedContact(c);
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      active ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          {c.name} • {c.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          {c.detail}
                          {", "}
                          {[c.ward_name, c.district_name, c.province_name]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            editOne(c);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOne(c.id);
                          }}
                        >
                          Xoá
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddressOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => setAddressOpen(false)}
              disabled={!selectedContact}
            >
              Dùng địa chỉ này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddAddressModal
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
          setEditing(null);
          setLoading((prev) => prev + 1);
        }}
        onSave={saveAddress}
        contact={editing}
      />
    </>
  );
}
