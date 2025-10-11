import models from '../../models/index.js';
const { orders } = models;

const getAll = async () => {
    const data = await orders.findAll();
    return data;
};

const createOrder = async (orderData, options) => {
    const newOrder = await orders.create(orderData, options);
    return newOrder;
}

export default {
    getAll,
    createOrder
};
