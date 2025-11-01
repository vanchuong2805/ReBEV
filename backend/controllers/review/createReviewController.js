import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userReviewService from "../../services/user/userReviewService.js";

/**
 * @swagger
 * /api/order-details/{order_detail_id}/review:
 *   post:
 *     summary: Tạo đánh giá cho sản phẩm theo chi tiết đơn hàng
 *     description: Cho phép người dùng đã mua sản phẩm tạo review với điểm và bình luận. Yêu cầu token đăng nhập (Bearer Token).
 *     tags: [User Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_detail_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID chi tiết đơn hàng (order detail ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_detail_id
 *               - rating
 *             properties:
 *               order_detail_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID của chi tiết đơn hàng
 *               rating:
 *                 type: number
 *                 format: float
 *                 example: 5
 *                 description: Điểm đánh giá (1–5)
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm mlem!"
 *                 description: Nội dung bình luận (không bắt buộc)
 *     responses:
 *       200:
 *         description: Tạo đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo đánh giá thành công"
 *                 review:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     order_detail_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                     rating:
 *                       type: number
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "Sản phẩm mlem!"
 *                     create_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-01T10:00:00.000Z"
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không thể tạo đánh giá"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

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

        const review = await userReviewService.createReview({
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
        console.log(error)
        return res.status(500).json({
            message: ERROR_MESSAGE.CREATE_REVIEW_FAILED,
            error: error.message
        });
    }
};

export default createReview;