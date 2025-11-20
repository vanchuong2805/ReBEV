import cartService from '../../services/cart/cartService.js';
import postService from '../../services/post/postService.js';
import userService from '../../services/user/userService.js';

/**
 * @swagger
 * /api/carts/{user_id}:
 *   get:
 *     summary: Get all cart items of a user
 *     description: Retrieve all cart items for a specific user, grouped by seller information. Each seller group contains a list of posts added to the cart.
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user whose cart items are to be retrieved
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's cart items, grouped by seller
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seller_id:
 *                     type: integer
 *                     example: 12
 *                   seller_display_name:
 *                     type: string
 *                     example: "EcoShop Official"
 *                   seller_contact:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       phone:
 *                         type: string
 *                         example: "+84 987654321"
 *                       email:
 *                         type: string
 *                         example: "contact@ecoshop.vn"
 *                   items:
 *                     type: array
 *                     description: List of posts (products) from this seller
 *                     items:
 *                       type: object
 *                       properties:
 *                         post_id:
 *                           type: integer
 *                           example: 45
 *                         title:
 *                           type: string
 *                           example: "Túi vải thân thiện môi trường"
 *                         price:
 *                           type: number
 *                           example: 129000
 *                         weight:
 *                           type: number
 *                           example: 0.5
 *                         deposit_rate:
 *                           type: number
 *                           example: 0.2
 *                         commission_rate:
 *                           type: number
 *                           example: 0.1
 *                         is_deposit:
 *                           type: boolean
 *                           example: true
 *                         media:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               url:
 *                                 type: string
 *                                 example: "https://cdn.example.com/images/eco-bag.jpg"
 *                               type:
 *                                 type: string
 *                                 example: "image/jpeg"
 *       403:
 *         description: Forbidden – user does not have permission to access another user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden
 *       404:
 *         description: Cart not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cart not found
 *       500:
 *         description: Internal server error – failed to retrieve cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to get cart
 */

const getCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (parseInt(user_id) !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const carts = await cartService.getCartByUserId(user_id);

        const groupedCart = new Map();

        for (const cart of carts) {
            console.log(cart);
            const post = await postService.getCartItem(cart.post_id);
            if (!post) continue;
            const seller_id = post.user_id;
            const seller = await userService.getUser(seller_id);
            const seller_display_name = seller.display_name;

            const key = `${seller_id}-${post.seller_contact.id}`;

            if (!groupedCart.has(key)) {
                groupedCart.set(key, {
                    seller_id,
                    seller_display_name,
                    seller_contact: post.seller_contact,
                    items: [],
                });
            }

            groupedCart.get(key).items.push({
                post_id: post.id,
                title: post.title,
                price: post.price,
                weight: parseFloat(post.post_details[0]?.custom_value || 0),
                deposit_rate: post.category.deposit_rate,
                commission_rate: post.category.commission_rate,
                is_deposit: post.category.is_deposit,
                media: post.media,
            });
        }

        const cartItems = Array.from(groupedCart.values());
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Failed to get cart:', error);
        res.status(500).json({ error: 'Failed to get cart' });
    }
};

export default getCart;
