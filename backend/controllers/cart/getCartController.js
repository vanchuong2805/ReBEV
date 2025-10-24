import cartService from "../../services/cart/cartService.js";

/** 
 * @swagger
 * /api/carts/{user_id}:
 *   get:
 *     summary: Get cart items by user ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items
 *       404:
 *         description: Cart not found
 */

const getCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const carts = await cartService.getCartByUserId(user_id);
        res.status(200).json(carts);
    } catch (error) {
        console.error("Failed to get cart:", error);
        res.status(500).json({ error: "Failed to get cart" });
    }
}

export default getCart;