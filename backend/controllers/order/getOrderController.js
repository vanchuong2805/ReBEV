import orderService from '../../services/order/orderService.js';

/** 
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve the details of a specific order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 */

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
