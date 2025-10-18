import orderStatusService from '../../services/order/orderStatusService.js';
import orderService from '../../services/order/orderService.js';
import { ORDER_STATUS, ORDER_STATUS_TRANSITION } from '../../config/constants.js';

const changeStatus = async (req, res) => {
    try {
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
        await orderStatusService.updateOrderStatus({ order_id: id, status, description });
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};
export default changeStatus;
