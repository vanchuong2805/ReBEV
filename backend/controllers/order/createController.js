import { sequelize } from '../../models/index.js';
import baseService from '../../services/address/baseService.js';
import orderService from '../../services/order/orderService.js';
import orderStatusService from '../../services/order/orderStatusService.js';
import { ORDER_STATUS, ORDER_TYPE, POST_STATUS, TRANSACTION_TYPE } from '../../config/constants.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import userContactService from '../../services/user/userContactService.js';
import postService from '../../services/post/postService.js';
import dayjs from 'dayjs';
import momoService from '../../services/payment/momoService.js';

const createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { orders, paymentInfo } = req.body;
        if (!orders || orders.length === 0 || !paymentInfo) {
            return res.status(400).json({ error: 'Missing required fields of an order' });
        }
        const customer_id = req.user.id;
        let order_id = '';
        const orderLists = [];
        for (const orderData of orders) {
            const {
                seller_id,
                order_type,
                from_contact_id,
                to_contact_id,
                delivery_price,
                order_details,
                total_amount,
                weight,
            } = orderData;
            if (
                !seller_id ||
                !order_type ||
                !from_contact_id ||
                !to_contact_id ||
                delivery_price === undefined ||
                delivery_price < 0 ||
                !order_details ||
                order_details.length === 0 ||
                !total_amount ||
                weight === undefined
            ) {
                await t.rollback();
                return res.status(400).json({ error: 'Missing required fields of an order' });
            }
            if (customer_id === seller_id) {
                await t.rollback();
                return res.status(400).json({ error: 'Customer and seller cannot be the same' });
            }
            let from_contact;
            if (order_type === ORDER_TYPE.DEPOSIT) {
                const base = await baseService.getById(from_contact_id);
                if (!base) {
                    await t.rollback();
                    return res.status(404).json({ error: 'Base address not found' });
                }
                from_contact = base;
            } else {
                const sellerContact = await userContactService.getUserContact(from_contact_id);
                if (!sellerContact) {
                    await t.rollback();
                    return res.status(404).json({ error: 'Seller contact not found' });
                }
                from_contact = sellerContact;
            }
            const to_contact = await userContactService.getUserContact(to_contact_id);
            if (!to_contact) {
                await t.rollback();
                return res.status(404).json({ error: 'Customer contact not found' });
            }
            // Create order
            const newOrder = await orderService.createOrder(
                {
                    customer_id,
                    seller_id,
                    order_type,
                    from_contact: JSON.stringify(from_contact),
                    to_contact: JSON.stringify(to_contact),
                    delivery_price,
                    order_details,
                    total_amount,
                },
                { transaction: t }
            );

            newOrder.weight = weight;
            order_id += newOrder.id + '_';
            orderLists.push(newOrder);
            // Process each order detail

            for (const item of order_details) {
                const post = await postService.getById(item.post_id, {
                    transaction: t,
                });
                // Validate post existence and status
                if (!post || post.user_id !== seller_id || post.is_deleted || post.is_hidden) {
                    await t.rollback();
                    return res
                        .status(404)
                        .json({ error: `Post with ID ${item.post_id} not found` });
                }

                if (post.status !== POST_STATUS.APPROVED) {
                    await t.rollback();
                    return res.status(400).json({
                        error: `Post with ID ${item.post_id} is not approved or bought by order`,
                    });
                }

                // Update post status to RESERVED
                await postService.updateStatus(
                    post.id,
                    { status: POST_STATUS.RESERVED },
                    {
                        transaction: t,
                    }
                );

                // Create order detail record
                await orderDetailService.createOrderDetail(
                    {
                        ...item,
                        order_id: newOrder.id,
                        appointment_time: dayjs(item.appointment_time).format(
                            'YYYY-MM-DD HH:mm:ss'
                        ),
                    },
                    { transaction: t }
                );
            }

            // Create initial order status

            await orderStatusService.createOrderStatus(
                {
                    order_id: newOrder.id,
                    status: ORDER_STATUS.PENDING,
                },
                { transaction: t }
            );
        }

        await t.commit();
        // Call payment gateway (Momo)
        console.log(order_id);
        const payment = {
            amount: paymentInfo.total_amount,
            orderId: `${order_id}${Date.now()}`,
            orderInfo: `Payment for order ReBev`,
            extraData: JSON.stringify(orderLists),
            redirectUrl: paymentInfo.redirectUrl,
            ipnUrl: process.env.INTERNAL_API_URL + '/transactions',
        };

        console.log('Payment info:', process.env.INTERNAL_API_URL + '/transactions');

        const result = await momoService.createPayment(payment);
        if (!result.payUrl) {
            for (const order of orderLists) {
                await orderStatusService.updateOrderStatus({
                    order_id: order.id,
                    status: ORDER_STATUS.FAIL_PAY,
                });
                // Restore post status
                const order_details = await orderDetailService.getByOrderId(order.id);
                for (const item of order_details) {
                    await postService.updateStatus(item.post_id, POST_STATUS.APPROVED);
                }
            }
            return res.status(500).json({ error: 'Failed to create payment', order: newOrder });
        }
        res.status(201).json({
            payUrl: result.payUrl,
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export default createOrder;
