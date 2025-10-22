import { or } from 'sequelize';
import models from '../../models/index.js';
const { order_status } = models;

const getAll = async () => {
    const data = await order_status.findAll();
    return data;
};

const getCurrentStatus = async (orderId) => {
    const status = await order_status.findOne({
        where: { order_id: orderId },
        order: [['create_at', 'DESC']],
    });
    return status;
};

const createOrderStatus = async (data, options = {}) => {
    const status = await order_status.create(data, options);
    return status;
}

const updateOrderStatus = async (data, options = {}) => {
    const result = await order_status.create(data, options);
    return result;
}

export default {
    getAll,
    createOrderStatus,
    updateOrderStatus,
    getCurrentStatus,
};
