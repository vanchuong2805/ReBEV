import orderService from '../../services/order/orderService.js';
const getOrder = async (req, res) => {
    try {
        const user = req.user;
        const order = await orderService.getById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        } else {
            if (user.role === 0 && order.customer_id !== user.id && order.seller_id !== user.id) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default getOrder;
