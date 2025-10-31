import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import favoritePostService from "../../services/favorite/favoritePostService.js";
import postService from "../../services/post/postService.js";

/** 
 * @swagger
 * /api/favorites/{user_id}:
 *   post:
 *     summary: Create a favorite post
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Favorite post created successfully
 *       400:
 *         description: Bad request
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