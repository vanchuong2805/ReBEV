import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, redirect } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { createOrder, getDeliveryFees } from "../service";
import CheckoutBar from "../components/CheckoutBar";
import Header from "@/components/common/Header";

// chỉ import & xài AddAddressModal (không tạo file mới)
import AddAddressModal from "@/features/profile/components/settings/AddAddressModal";
import { getContactByUserId, deleteContact } from "@/features/profile/service";
import { getContactById } from "@/features/cart/service";

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
import { from } from "@apollo/client";

export default function CheckoutPage() {
  const { selectedTotal, selectedGroups } = useCart();
  const [paymentGroup, setPaymentGroup] = useState({});
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [addressOpen, setAddressOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const totalDeliveryFee = Object.values(paymentGroup).reduce(
      (acc, curr) => acc + curr.delivery_price,
      0
    );
    console.log(totalDeliveryFee);
    setShippingFee(totalDeliveryFee);
  }, [paymentGroup]);

  // lấy user id (tuỳ app của bạn)
  const userRaw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

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
        if (!selectedContact && list.length > 0) {
          setSelectedContact(list[0]);
        }
      } catch (e) {
        console.error("Load contacts failed:", e);
        setContacts([]);
      } finally {
        setContactsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressOpen, user?.id]);

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
        (c) => c.phone === payload.phone && c.detail === payload.detail
      );
      if (maybe) setSelectedContact(maybe);
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
      if (selectedContact?.id === id) {
        setSelectedContact(() => {
          const remain = contacts.filter((c) => c.id !== id);
          return remain[0] || null;
        });
      }
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
              {selectedContact ? (
                <div className="mt-1 text-sm text-gray-700">
                  <div className="font-medium">
                    {selectedContact.name} • {selectedContact.phone}
                  </div>
                  <div>
                    {selectedContact.detail}
                    {", "}
                    {[
                      selectedContact.ward_name,
                      selectedContact.district_name,
                      selectedContact.province_name,
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
              {selectedContact ? "Thay đổi" : "Chọn địa chỉ"}
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
        <div className="px-4 py-3">
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
        <DialogContent className="max-w-2xl">
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
                const active = selectedContact?.id === c.id;
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
        }}
        onSave={saveAddress}
        contact={editing}
      />
    </>
  );
}
