import cartService from '../../services/cart/cartService.js';

/** 
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get all cart items
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Successfully retrieved all cart items
 *       500:
 *         description: Internal server error
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

