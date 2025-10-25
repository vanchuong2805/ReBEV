import orderStatusService from '../../services/order/orderStatusService.js';
import orderService from '../../services/order/orderService.js';
import {
    ORDER_STATUS,
    ORDER_STATUS_TRANSITION,
    POST_STATUS,
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
} from '../../config/constants.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import postService from '../../services/post/postService.js';
import userService from '../../services/user/userService.js';
import transactionService from '../../services/transaction/transactionService.js';
import deliveryService from '../../services/delivery/deliveryService.js';
import postDetailService from '../../services/post/postDetailService.js';
import { sequelize } from '../../models/index.js';

const changeStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        // Extract and validate input data
        const { id } = req.params;
        const { status, description } = req.body;
        const user = req.user;
        const order = await orderService.getById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        } else {
            if (user.role === 0 && order.customer_id !== user.id && order.seller_id !== user.id) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        if (!Object.keys(ORDER_STATUS_TRANSITION).includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const currentStatus = order.order_statuses[order.order_statuses.length - 1]?.status;
        if (!ORDER_STATUS_TRANSITION[status].includes(currentStatus)) {
            return res
                .status(400)
                .json({ message: `Cannot change status from ${currentStatus} to ${status}` });
        }
        // Update order status
        await orderStatusService.updateOrderStatus(
            { order_id: id, status, description },
            { transaction: t }
        );
        // Process additional actions based on specific status changes
        // if (status === ORDER_STATUS.CANCELLED) {
        //     // Restore post statuses
        //     const orderDetails = await orderDetailService.getByOrderId(id);
        //     for (const item of orderDetails) {
        //         await postService.updateStatus(item.post_id, POST_STATUS.APPROVED);
        //     }
        //     // Issue refund to customer
        //     await userService.deposit(order.customer_id, order.total_amount, { transaction: t });
        //     // Record refund transaction
        //     await transactionService.createTransaction(
        //         {
        //             receiver_id: order.customer_id,
        //             amount: order.total_amount,
        //             transaction_type: TRANSACTION_TYPE.REFUND,
        //             related_order_id: id,
        //             status: TRANSACTION_STATUS.SUCCESS,
        //         },
        //         { transaction: t }
        //     );
        // } else if (status === ORDER_STATUS.DELIVERING) {
        //     // Get contact info
        //     const from_contact = JSON.parse(order.from_contact);
        //     const to_contact = JSON.parse(order.to_contact);
        //     // get order weight
        //     const orderDetails = await orderDetailService.getByOrderId(id);
        //     for (const item of orderDetails) {
        //         const postDetail = await postDetailService.getWeightByPostId(item.post_id);
        //         if (!postDetail) {
        //             throw new Error(`Weight detail not found for post ID: ${item.post_id}`);
        //         }
        //         order.weight = (order.weight || 0) + parseFloat(postDetail.custom_value);
        //     }
        //     // Create delivery order via external service
        //     const deliveryInfo = await deliveryService.createOrder({
        //         from_name: from_contact.name,
        //         from_phone: from_contact.phone,
        //         from_address: `${from_contact.detail}, ${from_contact.ward_name}, ${from_contact.district_name}, ${from_contact.province_name}`,
        //         from_ward_name: from_contact.ward_name,
        //         from_district_name: from_contact.district_name,
        //         from_province_name: from_contact.province_name,
        //         to_name: to_contact.name,
        //         to_phone: to_contact.phone,
        //         to_address: `${to_contact.detail}, ${to_contact.ward_name}, ${to_contact.district_name}, ${to_contact.province_name}`,
        //         to_ward_name: to_contact.ward_name,
        //         to_district_name: to_contact.district_name,
        //         to_province_name: to_contact.province_name,
        //         payment_type_id: 2, // Receiver pays
        //         service_type_id: 2, // Standard delivery
        //         required_note: 'CHOXEMHANGKHONGTHU',
        //         weight: order.weight,
        //         items: [
        //             {
        //                 name: 'Order Items',
        //                 code: 'Polo123',
        //                 quantity: 1,
        //                 price: 200000,
        //                 length: 12,
        //                 width: 12,
        //                 height: 12,
        //                 weight: order.weight,
        //             },
        //         ],
        //     });
        //     // check deliveryInfo for errors
        //     if (deliveryInfo.code !== 200) {
        //         throw new Error(
        //             `Failed to create delivery order: ${deliveryInfo.message || 'Unknown error'}`
        //         );
        //     }

        //     // Update order with delivery details

        //     await orderService.updateOrder(id, { delivery_code: deliveryInfo.data.order_code });
        // }

        await orderStatusService.handleStatus(order, status, t);

        await t.commit();

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        if (t) await t.rollback();
        console.error('Error updating order status:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export default changeStatus;
