import { sequelize } from '../../models/index.js';
import baseService from '../../services/address/baseService.js';
import orderService from '../../services/order/orderService.js';
import orderStatusService from '../../services/order/orderStatusService.js';
import { ORDER_STATUS, ORDER_TYPE, POST_STATUS } from '../../config/constants.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import userContactService from '../../services/user/userContactService.js';
import postService from '../../services/post/postService.js';
import dayjs from 'dayjs';

const createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            seller_id,
            order_type,
            from_contact_id,
            to_contact_id,
            delivery_price,
            order_details,
            total_amount,
        } = req.body;

        const customer_id = req.user.id;

        if (
            !seller_id ||
            !order_type ||
            !from_contact_id ||
            !to_contact_id ||
            !delivery_price ||
            !order_details ||
            order_details.length === 0 ||
            !total_amount
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (customer_id === seller_id) {
            return res.status(400).json({ error: 'Customer and seller cannot be the same' });
        }
        let from_contact;
        if (order_type === ORDER_TYPE.DEPOSIT) {
            const base = await baseService.getById(from_contact_id);
            if (!base) {
                return res.status(404).json({ error: 'Base address not found' });
            }
            from_contact = base;
        } else {
            const sellerContact = await userContactService.getUserContact(from_contact_id);
            if (!sellerContact) {
                return res.status(404).json({ error: 'Seller contact not found' });
            }
            from_contact = sellerContact;
        }
        const to_contact = await userContactService.getUserContact(to_contact_id);
        if (!to_contact) {
            return res.status(404).json({ error: 'Customer contact not found' });
        }
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
        for (const item of order_details) {
            const post = await postService.getById(item.post_id, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            if (!post || post.user_id !== seller_id || post.is_deleted || post.is_hidden) {
                await t.rollback();
                return res.status(404).json({ error: `Post with ID ${item.post_id} not found` });
            }

            if (post.status !== POST_STATUS.APPROVED) {
                await t.rollback();
                return res.status(400).json({
                    error: `Post with ID ${item.post_id} is not approved or bought by order`,
                });
            }

            await postService.updateStatus(item.post_id, POST_STATUS.RESERVED, { transaction: t });
            await orderDetailService.createOrderDetail(
                {
                    ...item,
                    order_id: newOrder.id,
                    appointment_time: dayjs(item.appointment_time).format('YYYY-MM-DD HH:mm:ss'),
                },
                { transaction: t }
            );
        }
        await orderStatusService.createOrderStatus(
            {
                order_id: newOrder.id,
                status: ORDER_STATUS.PENDING,
            },
            { transaction: t }
        );
        await t.commit();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default createOrder;
