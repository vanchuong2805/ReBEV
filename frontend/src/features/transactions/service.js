import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const DELIVERY_API_URL = import.meta.env.VITE_GHN_API;

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export const getAppointmentTimes = async ({
  from_district_id,
  to_district_id,
  from_ward_code,
  to_ward_code,
}) => {
  const response = await axios.post(
    `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
    {
      from_district_id,
      to_district_id,
      from_ward_code,
      to_ward_code,
      service_id: 53322,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Token: import.meta.env.VITE_GHN_TOKEN,
      },
    }
  );
  return response.data;
};

export const getDeliveryFees = async ({
  from_district_id,
  to_district_id,
  from_ward_code,
  to_ward_code,
  weight,
}) => {
  console.log({
    from_district_id: from_district_id,
    to_district_id: to_district_id,
    from_ward_code: from_ward_code,
    to_ward_code: to_ward_code,
    weight,
    items: [{ weight }],
    service_type_id: 2,
  });
  let response = null;
  try {
    response = await axios.post(
      `${DELIVERY_API_URL}/v2/shipping-order/fee`,
      {
        from_district_id: from_district_id,
        to_district_id: to_district_id,
        from_ward_code: from_ward_code,
        to_ward_code: to_ward_code,
        weight,
        items: [{ weight }],
        service_type_id: 2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_GHN_TOKEN,
        },
      }
    );
  } catch (error) {
    console.log(error);
    response = await axios.post(
      `${DELIVERY_API_URL}/v2/shipping-order/fee`,
      {
        from_district_id: from_district_id,
        to_district_id: to_district_id,
        from_ward_code: from_ward_code,
        to_ward_code: to_ward_code,
        weight,
        items: [{ weight }],
        service_type_id: 5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: import.meta.env.VITE_GHN_TOKEN,
        },
      }
    );
  }
  return response.data.data.total;
};
