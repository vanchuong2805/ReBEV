import cartService from "../../services/cart/cartService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import postService from "../../services/post/postService.js";

const createCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { post_id } = req.body;
        const errors = [];



        const postByUser = await postService.getByUserId(user_id);
        const existedCartItem = await cartService.findCartItem({ user_id, post_id });

        if (existedCartItem) {
            errors.push(ERROR_MESSAGE.CART_ITEM_EXISTED);
        }

        if (postByUser.id !== post_id) {
            errors.push(ERROR_MESSAGE.CREATE_CART_FAIL);
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
