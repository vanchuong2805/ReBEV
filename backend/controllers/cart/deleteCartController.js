import cartService from '../../services/cart/cartService.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import { ERROR_MESSAGE } from '../../config/constants.js';

/** 
 * @swagger
 * /api/carts/delete/{post_id}:
 *   delete:
 *     summary: Delete a cart item
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The ID of the post to remove from the cart
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       404:
 *         description: Cart item not found
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