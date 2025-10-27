import cartService from "../../services/cart/cartService.js";
import postService from "../../services/post/postService.js";
import userService from "../../services/user/userService.js";

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
        if (parseInt(user_id) !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const carts = await cartService.getCartByUserId(user_id);

        const groupedCart = {};

        for (const cart of carts) {
            const post = await postService.getCartItem(cart.post_id);
            if (!post) continue;
            const seller_id = post.user_id;
            const seller_contact_id = post.seller_contact_id;
            const seller = await userService.getUser(seller_id);
            const seller_display_name = seller.display_name;

            const key = `${seller_id}-${seller_contact_id}`;


            if (!groupedCart[key]) {
                groupedCart[key] = {
                    seller_id,
                    seller_display_name,
                    seller_contact_id,
                    items: [],
                };
            }

            groupedCart[key].items.push({
                post_id: post.id,
                title: post.title,
                price: post.price,
                weight: parseFloat(post.post_details[0]?.custom_value || 0),
                deposit_rate: post.category.deposit_rate,
                commission_rate: post.category.commission_rate,
                is_deposit: post.category.is_deposit,
            });
        }
        const cartItems = Object.values(groupedCart);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Failed to get cart:", error);
        res.status(500).json({ error: "Failed to get cart" });
    }
}

export default getCart;