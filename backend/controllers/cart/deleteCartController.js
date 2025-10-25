import cartService from '../../services/cart/cartService.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import { ERROR_MESSAGE } from '../../config/constants.js';

const deleteCart = async (req, res) => {
    try {
        const { post_id } = req.params;

        const cart = await cartService.getCartByPostId(post_id);

        if (!cart) {
            return res.status(404).json({
                error: ERROR_MESSAGE.CART_ITEM_NOT_FOUND
            });
        }

        res.status(200).json({
            message: SUCCESS_MESSAGE.DELETE_CART_SUCCESS,
            cart: await cartService.deleteCart({ post_id })
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.DELETE_CART_FAIL, error);
        res.status(400).json({
            error: ERROR_MESSAGE.DELETE_CART_FAIL
        })
    }
}

export default deleteCart;