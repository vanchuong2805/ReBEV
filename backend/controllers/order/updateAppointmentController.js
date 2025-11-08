import { ORDER_STATUS } from '../../config/constants.js';
import orderDetailService from '../../services/order/orderDetailService.js';
import orderService from '../../services/order/orderService.js';
import orderStatusService from '../../services/order/orderStatusService.js';

/**
 * @swagger
 * /api/order-details/{orderId}/appointmentTime:
 *   put:
 *     summary: Update appointment time
 *     description: Update the appointment time for a specific order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Appointment time updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

const updateAppointmentTime = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { appointment_time } = req.body;
        const user = req.user;
        // Validate input
        if (!appointment_time) {
            return res.status(400).json({ message: 'Appointment time is required' });
        }
        const order = await orderService.getById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.customer_id !== user.id) {
            return res
                .status(403)
                .json({ message: 'Forbidden: You can only update your own orders' });
        }
        const orderStatus = await orderStatusService.getCurrentStatus(orderId);
        if (orderStatus?.status !== ORDER_STATUS.PENDING) {
            return res
                .status(400)
                .json({ message: 'Only orders with PENDING status can update appointment time' });
        }
        // Update appointment time
        await orderDetailService.updateAppointmentTime(orderId, appointment_time);
        return res.status(200).json({ message: 'Appointment time updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default updateAppointmentTime;
