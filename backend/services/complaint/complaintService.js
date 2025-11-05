import {
    COMPLAINT_STATUS,
    ORDER_STATUS,
    ORDER_TYPE,
    POST_STATUS,
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
} from '../../config/constants.js';
import models from '../../models/index.js';
import orderDetailService from '../order/orderDetailService.js';
import orderService from '../order/orderService.js';
import orderStatusService from '../order/orderStatusService.js';
import postService from '../post/postService.js';
import transactionService from '../transaction/transactionService.js';
import userService from '../user/userService.js';

const { complaints } = models;

const getByUserId = async (userId) => {
    const data = await complaints.findAll({
        include: [
            {
                association: 'order_detail',
                include: ['post'],
            },
        ],
        where: { user_id: userId },
    });
    return data;
};

const getByOrderDetailId = async (orderDetailId) => {
    const data = await complaints.findOne({ where: { order_detail_id: orderDetailId } });
    return data;
};

const createComplaint = async (data, options = {}) => {
    const complaint = await complaints.create(data, options);
    return complaint;
};

const updateStatus = async (id, status, options = {}) => {
    const result = await complaints.update(
        { complaint_status: status },
        { where: { id }, ...options }
    );
    return result;
};

const handleCancelComplaint = async (order_detail_id, t) => {
    const order_detail = await orderDetailService.getById(order_detail_id);
    const order = await orderService.getById(order_detail.order_id);
    // sold posts
    await postService.updateStatus(
        order_detail.post_id,
        { status: POST_STATUS.SOLD },
        { transaction: t }
    );
    // deposit money to seller
    await userService.deposit(
        order.seller_id,
        order_detail.price - order_detail.commission_amount,
        { transaction: t }
    );
    await transactionService.createTransaction(
        {
            receiver_id: order.seller_id,
            amount: order_detail.price - order_detail.commission_amount,
            transaction_type: TRANSACTION_TYPE.RELEASE,
            related_order_detail_id: order_detail_id,
            status: TRANSACTION_STATUS.SUCCESS,
        },
        { transaction: t }
    );
};

const handleResolveComplaint = async (order_detail_id, t) => {
    // Currently no specific action needed when complaint is resolved
    const order_detail = await orderDetailService.getById(order_detail_id);
    const order = await orderService.getById(order_detail.order_id);

    const returnOrder = await orderService.createOrder(
        {
            customer_id: order.customer_id,
            seller_id: order.seller_id,
            order_type: ORDER_TYPE.RETURN,
            total_amount: order_detail.price,
            from_contact: order.to_contact,
            to_contact: order.from_contact,
            delivery_price: order.delivery_price,
        },
        { transaction: t }
    );
    await orderDetailService.createOrderDetail(
        {
            order_id: returnOrder.id,
            post_id: order_detail.post_id,
            price: order_detail.price,
            commission_amount: 0,
            deposit_amount: 0,
            appointment_time: order_detail.appointment_time.toISOString(),
        },
        { transaction: t }
    );

    await orderStatusService.createOrderStatus(
        { order_id: returnOrder.id, status: ORDER_STATUS.PENDING },
        { transaction: t }
    );
};

const mapStatusHandlers = {
    [COMPLAINT_STATUS.CANCELLED]: handleCancelComplaint,
    [COMPLAINT_STATUS.REJECTED]: handleCancelComplaint,
    [COMPLAINT_STATUS.RESOLVED]: handleResolveComplaint,
};

const handleStatus = async (order_detail_id, status, t) => {
    const handler = mapStatusHandlers[status];
    if (handler) {
        await handler(order_detail_id, t);
    }
};

const getById = async (id) => {
    const data = await complaints.findOne({ where: { id } });
    return data;
};

export default {
    getByOrderDetailId,
    createComplaint,
    handleStatus,
    getById,
    updateStatus,
    getByUserId,
};
