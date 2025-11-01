import cartService from '../../services/cart/cartService.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import { ERROR_MESSAGE } from '../../config/constants.js';

/**
 * @swagger
 * /api/carts/delete/{post_id}:
 *   delete:
 *     summary: Remove a post from the user's cart
 *     description: Deletes a cart item belonging to the authenticated user based on the provided post ID.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []   # nếu API yêu cầu xác thực JWT
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The ID of the post to remove from the user's cart
 *         schema:
 *           type: integer
 *           example: 45
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete cart successfully"
 *                 cart:
 *                   type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                       example: 45
 *                     user_id:
 *                       type: integer
 *                       example: 12
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cart item not found"
 *       400:
 *         description: Bad request (failed to delete or invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete cart item"
 *       500:
 *         description: Internal server error (unexpected)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected server error"
 */

const deleteCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { post_id } = req.params;

        const cart = await cartService.getCartByPostId(post_id);

        if (!cart) {
            return res.status(404).json({
                error: ERROR_MESSAGE.CART_ITEM_NOT_FOUND
            });
        }

        res.status(200).json({
            message: SUCCESS_MESSAGE.DELETE_CART_SUCCESS,
            cart: await cartService.deleteCart({
                post_id,
                user_id
            })
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.DELETE_CART_FAIL, error);
        res.status(400).json({
            error: ERROR_MESSAGE.DELETE_CART_FAIL
        })
    }
}

export default deleteCart;