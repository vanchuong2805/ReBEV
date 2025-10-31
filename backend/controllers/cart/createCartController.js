import cartService from "../../services/cart/cartService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import postService from "../../services/post/postService.js";

/** 
 * @swagger
 * /api/carts/{user_id}:
 *   post:
 *     summary: Create a new cart item
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *                 description: The ID of the post to add to the cart
 *     responses:
 *       200:
 *         description: Cart item created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */

const createCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { post_id } = req.body;
        const errors = [];

        const post = await postService.getById(post_id);

        if (post.user_id === parseInt(user_id)) {
            errors.push(ERROR_MESSAGE.CREATE_CART_FAIL);
        }

        const existedCart = await cartService.findCartItem({
            user_id,
            post_id
        });

        if (existedCart) {
            errors.push(ERROR_MESSAGE.CART_ITEM_EXISTED);
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const cart = await cartService.createCart({
            user_id: user_id,
            post_id
        });

        res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_CART_SUCCESS,
            cart: cart,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.CREATE_CART_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default createCart;
