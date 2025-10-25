import cartService from '../../services/cart/cartService.js';

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

