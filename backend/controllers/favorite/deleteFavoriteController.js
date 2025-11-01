import favoritePostService from "../../services/favorite/favoritePostService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/favorites/delete/{post_id}:
 *   delete:
 *     summary: Xóa một bài viết khỏi danh sách yêu thích của người dùng
 *     tags: [Favorites]
 *     description: API cho phép người dùng xóa một bài viết đã được thêm vào danh sách yêu thích của họ.
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: ID của bài viết cần xóa khỏi danh sách yêu thích
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Xóa bài viết khỏi danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Favorite post deleted successfully"
 *                 favorite:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     post_id:
 *                       type: integer
 *                       example: 12
 *       400:
 *         description: Yêu cầu không hợp lệ — bài viết không tồn tại trong danh sách yêu thích hoặc lỗi logic khác
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Favorite not found"
 *       500:
 *         description: Lỗi máy chủ trong quá trình xử lý yêu cầu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "DELETE_FAVORITE_FAIL"
 */


const deleteFavorite = async (req, res) => {
    try {
        const {
            post_id,
        } = req.params;

        const favorite = await favoritePostService.getByPostId(post_id);

        if (!favorite) {
            return res.status(400).json({
                errors: ERROR_MESSAGE.FAVORITE_NOT_FOUND
            });
        }

        res.status(200).json({
            message: SUCCESS_MESSAGE.DELETE_FAVORITE_SUCCESS,
            favorite: await favoritePostService.deleteFavoritePost({ post_id }),
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.DELETE_FAVORITE_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default deleteFavorite;