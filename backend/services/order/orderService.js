import { Op, Sequelize } from 'sequelize';
import { ORDER_STATUS } from '../../config/constants.js';
import models from '../../models/index.js';
const { orders } = models;

const getOrders = async (options) => {
    const {
        order_type,
        customer_id,
        seller_id,
        page,
        limit,
        order_id,
        priority = ORDER_STATUS.DELIVERED,
        order_status,
    } = options;

    const where = {};

    if (order_type) {
        if (Array.isArray(order_type)) {
            where.order_type = { [Op.in]: order_type };
        } else {
            where.order_type = order_type;
        }
    }

    if (customer_id) {
        where.customer_id = customer_id;
    }
    if (seller_id) {
        where.seller_id = seller_id;
    }
    if (order_id) {
        where.id = order_id;
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || null;
    const offset = (pageNum - 1) * pageSize;

    const ordersData = await orders.findAll({
        include: [
            {
                association: 'order_statuses',
                where: {
                    create_at: {
                        [Op.eq]: Sequelize.literal(
                            `(SELECT MAX(create_at) FROM order_status WHERE order_status.order_id = orders.id)`
                        ),
                    },
                },
                include: [
                    {
                        association: 'create_by_user',
                        attributes: ['id', 'display_name', 'email', 'phone', 'avatar'],
                    },
                ],
                attributes: ['id', 'status', 'description', 'create_at', 'create_by'],
            },
            {
                association: 'order_details',
                include: [
                    {
                        association: 'post',
                        attributes: ['id', 'title', 'price', 'media', 'status'],
                    },
                    {
                        association: 'user_reviews',
                        attributes: ['id', 'rating_value', 'comment'],
                    },
                    {
                        association: 'complaints',
                        attributes: ['id'],
                    },
                ],
                attributes: ['id', 'contract_file', 'appointment_time'],
            },
            {
                association: 'customer',
                attributes: ['id', 'display_name', 'email', 'phone', 'avatar'],
            },
            {
                association: 'seller',
                attributes: ['id', 'display_name', 'email', 'phone', 'avatar'],
            },
        ],
        attributes: ['id', 'total_amount', 'delivery_price', 'order_type'],
        where: {
            ...where,
            ...(order_status ? { '$order_statuses.status$': order_status } : {}),
        },
        ...(pageSize ? { limit: pageSize, offset } : {}),
        subQuery: false,
        // order by  priority status first, then by most recent status update
        order: [
            [
                Sequelize.literal(`
                CASE
                    WHEN order_statuses.status = '${priority}' THEN 0
                    WHEN order_statuses.status = '${ORDER_STATUS.CONFIRMED}' THEN 1
                    ELSE 4
                END`),
                'ASC',
            ],
            [Sequelize.col('order_statuses.create_at'), 'DESC'],
        ],
    });

    const total = await orders.count({ where });

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
        include: [
            {
                association: 'order_details',
                include: ['post', 'user_reviews'],
            },
            'order_statuses',
        ],
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
