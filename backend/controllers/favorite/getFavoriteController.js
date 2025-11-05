import favoritePostService from "../../services/favorite/favoritePostService.js";
import postService from "../../services/post/postService.js";

/**
 * @swagger
 * /api/favorites/{userId}:
 *   get:
 *     summary: Lấy danh sách bài viết yêu thích của người dùng theo ID
 *     tags: [Favorites]
 *     description: API này trả về tất cả các bài viết mà người dùng đã đánh dấu yêu thích, kèm theo thông tin chi tiết của bài viết.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID của người dùng cần lấy danh sách bài viết yêu thích
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách bài viết yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 favoritePosts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       title:
 *                         type: string
 *                         example: "Bàn làm việc gỗ sồi cao cấp"
 *                       description:
 *                         type: string
 *                         example: "Chiếc bàn gỗ tự nhiên với thiết kế hiện đại và bền bỉ."
 *                       price:
 *                         type: number
 *                         example: 2500000
 *                       user_id:
 *                         type: integer
 *                         example: 3
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-31T08:22:00.000Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-31T10:00:00.000Z"
 *       404:
 *         description: Không tìm thấy bài viết yêu thích nào cho người dùng này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No favorite posts found for this user"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

const getFavorite = async (req, res) => {
    try {
        const userId = req.params.userId;

        const favorite = await favoritePostService.getByUserId(userId);

        const response = {
            userId,
            favoritePosts: []
        };
        for (const items of favorite) {
            const post = await postService.getById(items.post_id);
            response.favoritePosts.push(post);
        }
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching favorite posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default getFavorite;