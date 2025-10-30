import orderStatusService from '../../services/order/orderStatusService.js';
import orderService from '../../services/order/orderService.js';
import { ORDER_STATUS, ORDER_STATUS_TRANSITION, ORDER_TYPE_STATUS } from '../../config/constants.js';
import { sequelize } from '../../models/index.js';

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Change order status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['CONFIRMED', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'RESERVED']
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

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
            if (
                (user.role === 0 && order.customer_id !== user.id && order.seller_id !== user.id) ||
                (order.customer_id === user.id && status === ORDER_STATUS.SELLER_CANCELLED) ||
                (order.seller_id === user.id && status === ORDER_STATUS.CUSTOMER_CANCELLED)
            ) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        if (!ORDER_TYPE_STATUS[order.order_type].includes(status)) {
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
            { order_id: id, status, description, create_by: user.id },
            { transaction: t }
        );

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
