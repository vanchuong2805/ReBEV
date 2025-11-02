import models from '../../models/index.js';
import orderDetailService from './orderDetailService.js';
import userService from '../user/userService.js';
import postService from '../post/postService.js';
import {
    COMPLAINT_STATUS,
    ORDER_STATUS,
    ORDER_TYPE,
    POST_STATUS,
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
} from '../../config/constants.js';
import transactionService from '../transaction/transactionService.js';
import complaintService from '../complaint/complaintService.js';
import orderService from './orderService.js';
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
};

const updateOrderStatus = async (data, options = {}) => {
    const result = await order_status.create(data, options);
    return result;
};

const handleCancelledStatus = async (order, t) => {
    // Restore post statuses
    const orderDetails = await orderDetailService.getByOrderId(order.id);
    for (const item of orderDetails) {
        await postService.updateStatus(item.post_id, { status: POST_STATUS.APPROVED });
    }
    // Issue refund to customer
    await userService.deposit(order.customer_id, order.total_amount, { transaction: t });
    // Record refund transaction
    await transactionService.createTransaction(
        {
            receiver_id: order.customer_id,
            amount: order.total_amount,
            transaction_type: TRANSACTION_TYPE.REFUND,
            related_order_id: order.id,
            status: TRANSACTION_STATUS.SUCCESS,
        },
        { transaction: t }
    );
};

const handleDeliveringStatus = async (order, t) => {
    // Get contact info
    const from_contact = JSON.parse(order.from_contact);
    const to_contact = JSON.parse(order.to_contact);
    // get order weight
    const orderDetails = await orderDetailService.getByOrderId(order.id);
    for (const item of orderDetails) {
        const postDetail = await postDetailService.getWeightByPostId(item.post_id);
        if (!postDetail) {
            throw new Error(`Weight detail not found for post ID: ${item.post_id}`);
        }
        order.weight = (order.weight || 0) + parseFloat(postDetail.custom_value);
    }
    // Create delivery order via external service
    const deliveryInfo = await deliveryService.createOrder({
        from_name: from_contact.name,
        from_phone: from_contact.phone,
        from_address: `${from_contact.detail}, ${from_contact.ward_name}, ${from_contact.district_name}, ${from_contact.province_name}`,
        from_ward_name: from_contact.ward_name,
        from_district_name: from_contact.district_name,
        from_province_name: from_contact.province_name,
        to_name: to_contact.name,
        to_phone: to_contact.phone,
        to_address: `${to_contact.detail}, ${to_contact.ward_name}, ${to_contact.district_name}, ${to_contact.province_name}`,
        to_ward_name: to_contact.ward_name,
        to_district_name: to_contact.district_name,
        to_province_name: to_contact.province_name,
        payment_type_id: 2, // Receiver pays
        service_type_id: 2, // Standard delivery
        required_note: 'CHOXEMHANGKHONGTHU',
        weight: order.weight,
        items: [
            {
                name: 'Order Items',
                code: `${order.id}`,
                quantity: 1,
                price: order.total_amount,
                length: 12,
                width: 12,
                height: 12,
                weight: order.weight,
            },
        ],
    });
    // check deliveryInfo for errors
    if (deliveryInfo.code !== 200) {
        throw new Error(
            `Failed to create delivery order: ${deliveryInfo.message || 'Unknown error'}`
        );
    }

    // Update order with delivery details

    await orderService.updateOrder(id, { delivery_code: deliveryInfo.data.order_code });
};

const handleDeliveredStatus = async (order, t) => {};

const handleCompletedStatus = async (order, t) => {
    const orderDetails = await orderDetailService.getByOrderId(order.id);
    for (const item of orderDetails) {
        const orderDetail = await complaintService.getByOrderDetailId(item.id);
        if (!orderDetail) {
            // No complaint, proceed to mark post as SOLD
            await postService.updateStatus(
                item.post_id,
                {
                    status:
                        order.order_type === ORDER_TYPE.RETURN
                            ? POST_STATUS.APPROVED
                            : POST_STATUS.SOLD,
                },
                { transaction: t }
            );
            const amount =
                [ORDER_TYPE.BUY, ORDER_TYPE.RETURN].includes(order.order_type)
                    ? item.price - item.commission_amount
                    : item.deposit_amount;
            // Release payment to seller
            // Create transaction record
            await transactionService.createTransaction(
                {
                    receiver_id: order.seller_id,
                    amount,
                    transaction_type: (order.order_type === ORDER_TYPE.RETURN
                        ? TRANSACTION_TYPE.REFUND
                        : TRANSACTION_TYPE.RELEASE),
                    related_order_detail_id: item.id,
                    status: TRANSACTION_STATUS.SUCCESS,
                },
                { transaction: t }
            );
            // Deposit amount to seller's account
            await userService.deposit(order.seller_id, amount, { transaction: t });
        }
    }
};

const handleCustomerCancelledStatus = async (order, t) => {
    // Restore post statuses
    const orderDetails = await orderDetailService.getByOrderId(order.id);
    for (const item of orderDetails) {
        await postService.updateStatus(item.post_id, { status: POST_STATUS.APPROVED });
    }
    // Issue refund to customer
    await userService.deposit(order.seller_id, order.total_amount, { transaction: t });
    // Record refund transaction
    await transactionService.createTransaction(
        {
            receiver_id: order.seller_id,
            amount: order.total_amount,
            transaction_type: TRANSACTION_TYPE.RELEASE,
            related_order_id: order.id,
            status: TRANSACTION_STATUS.SUCCESS,
        },
        { transaction: t }
    );
};

const mapStatusHandlers = {
    [ORDER_STATUS.CANCELLED]: handleCancelledStatus,
    [ORDER_STATUS.DELIVERING]: handleDeliveringStatus,
    [ORDER_STATUS.COMPLETED]: handleCompletedStatus,
    [ORDER_STATUS.DELIVERED]: handleDeliveredStatus,
    [ORDER_STATUS.CUSTOMER_CANCELLED]: handleCustomerCancelledStatus,
    [ORDER_STATUS.SELLER_CANCELLED]: handleCancelledStatus,
    [ORDER_STATUS.RETURNED]: handleCompletedStatus,
};

const handleStatus = async (order, status, t) => {
    const handler = mapStatusHandlers[status];
    if (handler) {
        await handler(order, t);
    }
};

const getLatestStatus = async (orderId) => {
    const data = await order_status.findOne({
        where: {
            order_id: orderId,
        },
        order: [['created_at', 'DESC']],
    });
    return data;
};

export default {
    getAll,
    createOrderStatus,
    updateOrderStatus,
    getCurrentStatus,
    handleStatus,
    getLatestStatus,
};

export { handleCompletedStatus };
