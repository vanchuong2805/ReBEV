import orderService from '../../services/order/orderService.js';
import { ORDER_TYPE, ROLE } from '../../config/constants.js';
import { Op } from 'sequelize';

/**
 * @swagger
 * /orders:
 *  get:
 *    summary: Get all orders
 *    tags: [Orders]
 *    parameters:
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *          enum: [customer, seller]
 *        description: Filter orders by user role
 *     - in: query
 *       name: order_type
 *       schema:
 *         type: string
 *         enum: [1, 2, 3]
 *       description: Filter orders by order type [1: Buy, 2: Deposit, 3: Return]
 *    - in: query
 *      name: page
 *      schema:
 *        type: integer
 *      description: The page number to retrieve
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *      description: The number of orders to retrieve per page
 *    responses:
 *      200:
 *        description: A list of orders
 *        content:
 *         application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Order'
 *      500:
 *        description: Internal server error
 */

const getOrders = async (req, res) => {
    try {
        const options = {};
        const order_types = req.query.order_type;
        const user = req.user;
        const { type, page, limit } = req.query;
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
        if (order_types) {
            console.log(order_types);
            if (Array.isArray(order_types)) {
                options.order_type = { [Op.in]: order_types };
            } else {
                options.order_type = order_types;
            }
        }
        const orders = await orderService.getOrders(options, { page, limit });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default getOrders;
