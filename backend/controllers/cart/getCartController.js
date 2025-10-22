import cartService from "../../services/cart/cartService.js";

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