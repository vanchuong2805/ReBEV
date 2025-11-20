import cartService from '../../services/cart/cartService.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import postService from '../../services/post/postService.js';
import userService from '../../services/user/userService.js';

/**
 * @swagger
 * /api/carts/{user_id}:
 *   post:
 *     summary: Add a post to the user's cart
 *     description: Creates a new cart item for a given user and post. A user cannot add their own post to their cart, and duplicate cart items are not allowed.
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user who is adding the item to their cart
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *                 description: The ID of the post to add to the cart
 *                 example: 45
 *     responses:
 *       200:
 *         description: Cart item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create cart successfully"
 *                 cart:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 101
 *                     user_id:
 *                       type: integer
 *                       example: 12
 *                     post_id:
 *                       type: integer
 *                       example: 45
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-31T13:45:00Z"
 *       400:
 *         description: Bad request (validation errors or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Cannot add your own post to cart"
 *                     - "Cart item already exists"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CREATE_CART_FAIL - Unexpected server error"
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
            post_id,
        });

        if (existedCart) {
            errors.push(ERROR_MESSAGE.CART_ITEM_EXISTED);
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const cart = await cartService.createCart({
            user_id: user_id,
            post_id,
        });

        const postItem = await postService.getCartItem(post_id);

        const seller_id = postItem.user_id;
        const seller = await userService.getUser(seller_id);
        const seller_display_name = seller.display_name;

        const cartItem = {
            seller_id,
            seller_display_name,
            seller_contact: postItem.seller_contact,
            item: {
                post_id: postItem.id,
                title: postItem.title,
                price: postItem.price,
                weight: parseFloat(postItem.post_details[0]?.custom_value || 0),
                deposit_rate: postItem.category.deposit_rate,
                commission_rate: postItem.category.commission_rate,
                is_deposit: postItem.category.is_deposit,
                media: postItem.media,
            },
        };

        res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_CART_SUCCESS,
            cart: cartItem,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.CREATE_CART_FAIL, error);
        res.status(400).json({
            error: error.message,
        });
    }
};

export default createCart;
