import models from '../../models/index.js';
const { order_status } = models;

const getAll = async () => {
    const data = await order_status.findAll();
    return data;
};

const createOrderStatus = async (data, options) => {
    const status = await order_status.create(data, options);
    return status;
}

export default {
    getAll,
    createOrderStatus
};
