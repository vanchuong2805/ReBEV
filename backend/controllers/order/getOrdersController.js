import orderService from '../../services/order/orderService.js';
import { ROLE } from '../../config/constants.js';
const getOrders = async (req, res) => {
    try {
        const options = {};
        const user = req.user;
        const { type } = req.query;
        if (user.role === ROLE.MEMBER) {
            if (type) {
                if (type === 'customer') {
                    options.customer_id = req.user.id;
                } else if (type === 'seller') {
                    options.seller_id = req.user.id;
                }
            } else {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        const orders = await orderService.getOrders(options);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default getOrders;
