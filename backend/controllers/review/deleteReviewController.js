import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userReviewService from "../../services/user/userReviewService.js";

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const existingReview = await userReviewService.getReview(reviewId);

        if (!existingReview) {
            return res.status(404).json({
                messages: ERROR_MESSAGE.REVIEW_NOT_FOUND
            });
        }

        return res.status(200).json({
            messages: SUCCESS_MESSAGE.DELETE_REVIEW_SUCCESS,
            review: await userReviewService.deleteReview(reviewId),

        });
    } catch (error) {
        return res.status(400).json({
            messages: ERROR_MESSAGE.DELETE_REVIEW_FAILED,
            error: error.message
        });
    }
}

export default deleteReview;