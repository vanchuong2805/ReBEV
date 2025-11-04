import { Op, Sequelize } from 'sequelize';
import { ORDER_STATUS } from '../../config/constants.js';
import models from '../../models/index.js';
const { orders } = models;

const getOrders = async (options, { page, limit }) => {
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || null;
    const offset = (pageNum - 1) * pageSize;
    const total = await orders.count({ where: options });

    const ordersData = await orders.findAll({
        include: [
            {
                association: 'order_statuses',
                separated: true,
                limit: 1,
                order: [['create_at', 'DESC']],
            },
            {
                association: 'order_details',
                include: ['post'],
            },
        ],
        where: options,
        ...(pageSize ? { limit: pageSize, offset } : {}),
    });

    const data = {
        orders: ordersData,
        pagination: pageSize ? { page: pageNum, limit: pageSize, total } : null,
    };
    return data;
};
//lấy các order đã giao hàng thành công và quá 7 ngày

const getOrdersDelivered = async () => {
    let ordersList = await orders.findAll({
        include: [
            {
                association: 'order_statuses',
                separate: true,
                limit: 1,
                order: [['id', 'DESC']],
            },
        ],
    });
    ordersList = ordersList.filter(
        (order) =>
            order?.order_statuses[0]?.status === ORDER_STATUS.DELIVERED &&
            new Date(order.order_statuses[0].create_at).getTime() + 7 * 24 * 60 * 60 * 1000 <
                new Date().getTime()
    );
    return ordersList;
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

const updateOrder = async (orderId, data, options = {}) => {
    return await orders.update(data, { where: { id: orderId }, ...options });
};

export default {
    getOrders,
    createOrder,
    getById,
    updateOrder,
    getOrdersDelivered,
};
