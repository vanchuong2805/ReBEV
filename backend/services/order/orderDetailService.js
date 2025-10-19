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

const createOrderDetail = async (data, options) => {
    const orderDetail = await order_detail.create(data, options);
    return orderDetail;
};

export default {
    getAll,
    createOrderDetails,
    createOrderDetail
};
