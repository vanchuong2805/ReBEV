import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import orderDetailService from "../../services/order/orderDetailService.js";

const createReview = async (req, res) => {
    try {
        const { user_id } = req.params;

        const {
            order_detail_id,
            rating,
            comment
        } = req.body;

        if (!order_detail_id || !rating) {
            return res.status(400).json({
                message: ERROR_MESSAGE.BLANK_INFORMATION,   
            });
        }

        const review = await orderDetailService.createReview({
            user_id,
            order_detail_id,
            rating,
            comment
        });

        return res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_REVIEW_SUCCESS,
            review,
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.CREATE_REVIEW_FAILED,
            error: error.message
        });
    }
};

export default createReview;