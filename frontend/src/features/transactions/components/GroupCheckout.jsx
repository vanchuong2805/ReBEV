import { useEffect, useState } from "react";
import { MapPin, Store } from "lucide-react";
import CheckoutItem from "./CheckoutItem";
import { getAppointmentTimes, getDeliveryFees } from "../service";

function GroupCheckout({ groupItems, customerContact, setPaymentGroup }) {
  const { detail, ward_name, district_name, province_name } =
    groupItems.seller_contact || {};
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [appointmentTimes, setAppointmentTimes] = useState("");
  const [loading, setLoading] = useState(true);
  const sellerContact = groupItems.seller_contact;
  const weight = groupItems.items.reduce(
    (acc, item) => acc + (item.weight || 0),
    0
  );
  const totalAmount = groupItems.items.reduce(
    (acc, item) => acc + item.price,
    0
  );

  useEffect(() => {
    // Calculate delivery fee when component mounts
    const fetchDeliveryFee = async () => {
      if (!groupItems || !customerContact) return;
      setLoading(true);
      try {
        const info = {
          from_district_id: sellerContact.district_id,
          to_district_id: customerContact.district_id,
          from_ward_code: sellerContact.ward_code,
          to_ward_code: customerContact.ward_code,
          weight,
        };
        const fee = await getDeliveryFees(info);

        setDeliveryFee(fee);
        const appointmentTimes = await getAppointmentTimes(info);
        setAppointmentTimes(
          appointmentTimes.data.leadtime_order.to_estimate_date
        );
        setPaymentGroup((prev) => ({
          ...prev,
          [`${groupItems.seller_id}_${sellerContact.id}`]: {
            delivery_price: fee,
            total_amount: totalAmount,
            appointment_time:
              appointmentTimes.data.leadtime_order.to_estimate_date,
          },
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryFee();
  }, [
    groupItems,
    customerContact,
    setPaymentGroup,
    sellerContact,
    weight,
    totalAmount,
  ]);

  return (
    <div className="mb-6 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Seller Header */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 text-lg font-bold text-gray-900">
              {groupItems.seller_display_name}
            </h3>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">
                {`${detail}, ${ward_name}, ${district_name}, ${province_name}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Items */}
      <div className="p-4 space-y-0">
        {groupItems.items.map((post) => (
          <CheckoutItem key={post.post_id} item={post} />
        ))}
      </div>

      {/* Summary */}
      <div className="p-5 space-y-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Thời gian giao hàng dự kiến</span>
          <span className="font-semibold text-gray-900">
            {loading
              ? "Đang tính..."
              : appointmentTimes
              ? new Date(appointmentTimes).toLocaleDateString("vi-VN")
              : "Đang cập nhật"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-semibold text-gray-900">
            {loading
              ? "..."
              : deliveryFee.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
          </span>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-300">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Tổng cộng</span>
            <span className="text-xl font-bold text-red-600">
              {(totalAmount + deliveryFee).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupCheckout;
