import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của người dùng
 *     description: Trả về thông tin người dùng theo ID (không bao gồm password) cùng điểm đánh giá (rating) trung bình.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của người dùng cần lấy thông tin
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "vana@example.com"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     role:
 *                       type: integer
 *                       description: "0 = customer (mặc định), các giá trị khác tùy app"
 *                       example: 0
 *                     balance:
 *                       type: string
 *                       description: "Decimal as string (precision preserved)"
 *                       example: "1000.50"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     package_id:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     is_locked:
 *                       type: boolean
 *                       example: false
 *                     package_start:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-01T07:00:00Z"
 *                     create_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-01T08:00:00Z"
 *                     update_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-30T09:00:00Z"
 *                 rating:
 *                   type: object
 *                   description: Điểm đánh giá trung bình và tổng số lượt đánh giá
 *                   properties:
 *                     average_rating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *                     total_reviews:
 *                       type: integer
 *                       example: 12
 *       400:
 *         description: ID người dùng không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user ID"
 *       404:
 *         description: Không tìm thấy người dùng với ID được cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Lỗi máy chủ nội bộ khi lấy thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get user"
 */

const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });

        }
        const rating = await userService.getUserRating(req.params.id);
        res.status(200).json({ user, rating });

    } catch (error) {
        console.error("Failed to get user:", error);
        res.status(500).json({ error: "Failed to get user" });
    }
};

export default getUser;