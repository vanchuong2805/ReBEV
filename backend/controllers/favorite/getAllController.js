import favoritePostService from "../../services/favorite/favoritePostService.js";

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Lấy tất cả các bài viết yêu thích của người dùng
 *     tags: [Favorites]
 *     description: API trả về danh sách tất cả các bài viết đã được người dùng đánh dấu yêu thích.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         description: Lọc danh sách theo ID người dùng (nếu cần)
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách bài viết yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   post_id:
 *                     type: integer
 *                     example: 12
 *       404:
 *         description: Không tìm thấy bài viết yêu thích nào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No favorite posts found"
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

const getAllFavorites = async (req, res) => {
    try {
        const favorites = await favoritePostService.getAll();

        res.status(200).json(favorites);

    } catch (error) {
        console.error("Error fetching favorite posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getAllFavorites;