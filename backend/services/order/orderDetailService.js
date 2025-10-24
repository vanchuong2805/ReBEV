import models from '../../models/index.js';
const { order_detail } = models;

const getAll = async () => {
    const data = await order_detail.findAll();
    return data;
};

const createOrderDetails = async (data, options) => {
    const orderDetails = await order_detail.bulkCreate(data, options);
    return orderDetails;
}

export default {
    getAll,
    createOrderDetails
};
