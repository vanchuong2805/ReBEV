import models from '../../models/index.js';
const { orders } = models;

const getOrders = async (options) => {
    const data = await orders.findAll({
        include: [{
            association: 'order_statuses',
            separated: true,
            limit: 1,
            order: [['create_at', 'DESC']],
        },
        'order_details'],
        where: options,
    });
    return data;
};

const getById = async (id) => {
    const order = await orders.findByPk(id, {
        include: ['order_details', 'order_statuses'],
    });
    return order;
};

const createOrder = async (orderData, options) => {
    const newOrder = await orders.create(orderData, options);
    return newOrder;
};


export default {
    getOrders,
    createOrder,
    getById,
};
