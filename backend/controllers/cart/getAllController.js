import cartService from '../../services/cart/cartService.js';

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Retrieve all cart items
 *     description: Fetch a list of all cart items available in the system. Each cart item includes product details and associated user information if applicable.
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Successfully retrieved all cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   post_id:
 *                     type: integer
 *                     example: 12
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-31T10:00:00.000Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-31T10:15:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

const getAll = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error fetching carts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getAll;

