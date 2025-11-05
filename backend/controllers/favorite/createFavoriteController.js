import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import favoritePostService from "../../services/favorite/favoritePostService.js";
import postService from "../../services/post/postService.js";

/**
 * @swagger
 * /api/favorites/{user_id}:
 *   post:
 *     summary: Thêm bài viết vào danh sách yêu thích của người dùng
 *     tags: [Favorites]
 *     description: API cho phép người dùng thêm một bài viết cụ thể vào danh sách yêu thích của họ.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID của người dùng thực hiện hành động yêu thích
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       description: Dữ liệu của bài viết cần thêm vào danh sách yêu thích
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *                 example: 12
 *                 description: ID của bài viết cần được thêm vào danh sách yêu thích
 *     responses:
 *       200:
 *         description: Thêm bài viết vào danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Favorite post created successfully"
 *                 favoritePost:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     post_id:
 *                       type: integer
 *                       example: 12
 *       400:
 *         description: Yêu cầu không hợp lệ — có thể do bài viết không tồn tại, đã được yêu thích, hoặc lỗi logic khác
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Post not found", "Favorite post already exists"]
 *       500:
 *         description: Lỗi máy chủ trong quá trình xử lý yêu cầu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CREATE_FAVORITE_FAIL"
 */

const createFavoritePost = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { post_id } = req.body;
        const errors = [];

        const post = await postService.getById(post_id);
        if (!post) {
            errors.push(ERROR_MESSAGE.POST_NOT_FOUND);
        }

        if (post.user_id === parseInt(user_id)) {
            errors.push(ERROR_MESSAGE.CREATE_FAVORITE_FAIL);
        }

        const existedFavoritePost = await favoritePostService.findFavoritePost({
            user_id,
            post_id
        });

        if (existedFavoritePost) {
            errors.push(ERROR_MESSAGE.FAVORITE_POST_EXISTED);
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const favoritePost = await favoritePostService.createFavoritePost({
            user_id: user_id,
            post_id
        });

        res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_FAVORITE_SUCCESS,
            favoritePost
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.CREATE_FAVORITE_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}
export default createFavoritePost;