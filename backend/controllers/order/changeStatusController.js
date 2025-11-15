import orderStatusService from '../../services/order/orderStatusService.js';
import orderService from '../../services/order/orderService.js';
import { ORDER_STATUS, ORDER_STATUS_TRANSITION, ORDER_TYPE_STATUS, ROLE } from '../../config/constants.js';
import { sequelize } from '../../models/index.js';

/** 
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     description: Update the status of an existing order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: The new status and description for the order
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [PENDING, PROCESSING, COMPLETED, CANCELLED]
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Invalid status value
 */

const changeStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        // Extract and validate input data
        const { id } = req.params;
        const { status, description, media } = req.body;
        const user = req.user;
        const order = await orderService.getById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        } else {
            if (
                (user.role === ROLE.MEMBER && order.customer_id !== user.id && order.seller_id !== user.id) ||
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
            { order_id: id, status, description, create_by: user.id, media: media ? JSON.stringify(media) : null },
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
