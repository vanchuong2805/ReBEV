const createOrder = async (orderData) => {
    // Logic to create a delivery order

    console.log(orderData)

    const res = await fetch(`${process.env.GHN_URL}create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Token: process.env.SHIPMENT_TOKEN,
        },
        body: JSON.stringify(orderData),
    });

    const order = await res.json();

    return order;

};
export default {
    createOrder,
};
