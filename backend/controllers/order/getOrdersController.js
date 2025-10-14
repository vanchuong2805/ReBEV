import orderService from '../../services/order/orderService.js';

const getOrders = async (req, res) => {
    try {
        const options = req.query;
        const orders = await orderService.getOrders(options);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default getOrders;