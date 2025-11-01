import CartItem from "@/features/cart/components/CartItem";
import { useEffect, useState } from "react";
import CheckoutItem from "./CheckoutItem";
import { getAppointmentTimes, getDeliveryFees } from "../service";
import { set } from "zod";

function GroupCheckout({ groupItems, customerContact, setPaymentGroup }) {
  const { detail, ward_name, district_name, province_name } =
    groupItems.seller_contact || {};
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [appointmentTimes, setAppointmentTimes] = useState("");
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
        alert("Chưa có dịch vụ cho địa chỉ này.");
      }
    };
    fetchDeliveryFee();
  }, [groupItems, customerContact]);

  return (
    <>
      <div key={groupItems.seller_id} className="p-4 mb-8 border rounded-lg">
        <strong>
          {groupItems.seller_display_name} |{" "}
          {`${detail}, ${ward_name}, ${district_name}, ${province_name}`}
        </strong>
        {groupItems.items.map((post) => (
          <CheckoutItem key={crypto.randomUUID()} item={post} />
        ))}
        <p className="font-semibold" style={{ textAlign: "right" }}>
          Thời gian giao hàng dự kiến:{" "}
          {new Date(appointmentTimes).toLocaleDateString("en-CA") ||
            "Đang cập nhật"}
        </p>
        <br />
        <p className="font-semibold" style={{ textAlign: "right" }}>
          Phí vận chuyển:{" "}
          {deliveryFee.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <br />
        <p className="font-semibold" style={{ textAlign: "right" }}>
          Tổng cộng:{" "}
          {(totalAmount + deliveryFee).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
    </>
  );
}

export default GroupCheckout;
