import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userReviewService from '../../services/user/userReviewService.js';

/**
 * @swagger
 * /api/user-reviews/{review_id}:
 *   put:
 *     summary: Cập nhật đánh giá của người dùng
 *     description: Cho phép người dùng cập nhật đánh giá của chính họ. Yêu cầu Bearer Token. Chỉ có chủ sở hữu review mới được phép chỉnh sửa.
 *     tags: [User Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: review_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của review cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 format: float
 *                 example: 4
 *                 description: Điểm đánh giá mới (1–5)
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm ngon, giá tốt!"
 *                 description: Nội dung bình luận mới của người dùng
 *     responses:
 *       200:
 *         description: Cập nhật đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật đánh giá thành công"
 *                 review:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                     rating:
 *                       type: number
 *                       example: 4
 *                     comment:
 *                       type: string
 *                       example: "Sản phẩm ngon, giá tốt!"
 *                     update_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-02T12:00:00.000Z"
 *       400:
 *         description: Thiếu thông tin hoặc lỗi trong quá trình cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin bắt buộc hoặc lỗi hệ thống"
 *                 error:
 *                   type: string
 *                   example: "UPDATE_REVIEW_FAILED"
 *       403:
 *         description: Người dùng không có quyền cập nhật review này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You can only update your own reviews"
 *       404:
 *         description: Không tìm thấy review tương ứng với ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy đánh giá"
 *       500:
 *         description: Lỗi hệ thống khi cập nhật đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật đánh giá thất bại"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

const updateReview = async (req, res) => {
    try {
        const { review_id } = req.params;

        const { user } = req;

        const {
            rating,
            comment
        } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                message: ERROR_MESSAGE.BLANK_INFORMATION,
            });
        }

        const existingReview = await userReviewService.getReview(review_id);

        if (!existingReview) {
            return res.status(404).json({
                message: ERROR_MESSAGE.REVIEW_NOT_FOUND,
            });
        }
        console.log(user)
        if (existingReview.user_id !== user.id) {
            return res.status(403).json({
                message: 'Forbidden: You can only update your own reviews',
            });
        }
        const updatedReview = await userReviewService.updateReview(review_id, {
            rating,
            comment,
            update_at: new Date()
        });

        res.status(200).json({
            message: SUCCESS_MESSAGE.UPDATE_REVIEW_SUCCESS,
            review: updatedReview
        });

    } catch (error) {
        return res.status(400).json({
            message: ERROR_MESSAGE.UPDATE_REVIEW_FAILED,
            error: error.message
        });
    }
}

export default updateReview;