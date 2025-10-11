import { sequelize } from '../../models/index.js';
import baseService from '../../services/address/baseService.js';
import orderService from '../../services/order/orderService.js';
import orderStatusService from '../../services/order/orderStatusService.js';
import { ORDER_STATUS, ORDER_TYPE } from '../../config/constants.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import dayjs from 'dayjs';

const createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            customer_id,
            seller_id,
            order_type,
            from_contact_id,
            to_contact_id,
            delivery_price,
            order_details,
            total_amount,
        } = req.body;

        if (
            !customer_id ||
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
        let from_contact;
        if (order_type === ORDER_TYPE.DEPOSIT) {
            const base = await baseService.getById(from_contact_id);
            if (!base) {
                return res.status(404).json({ error: 'From address not found' });
            }
            from_contact = base;
        }
        const newOrder = await orderService.createOrder(
            {
                customer_id,
                seller_id,
                order_type,
                from_contact: JSON.stringify(from_contact),
                to_contact: JSON.stringify(from_contact),
                delivery_price,
                order_details,
                total_amount,
            },
            { transaction: t }
        );
        await orderStatusService.createOrderStatus(
            {
                order_id: newOrder.id,
                status: ORDER_STATUS.PENDING,
            },
            { transaction: t }
        );

        const details = order_details.map((detail) => ({
            ...detail,
            order_id: newOrder.id,
            appointment_time: dayjs(detail.appointment_time).format('YYYY-MM-DD HH:mm:ss'),
        }));
        await orderDetailService.createOrderDetails(details, { transaction: t });
        await t.commit();
        res.status(201).json({message: 'Order created successfully'});
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default createOrder;
