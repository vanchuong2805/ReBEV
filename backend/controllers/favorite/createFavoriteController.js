import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import favoritePostService from "../../services/favorite/favoritePostService.js";
import postService from "../../services/post/postService.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FavoritePost:
 *       type: object
 *       description: Represents a user's favorite post
 *       properties:
 *         user_id:
 *           type: integer
 *           description: ID of the user who favorited the post
 *           example: 1
 *         post_id:
 *           type: integer
 *           description: ID of the post added to favorites
 *           example: 12
 *
 * /api/favorites/{user_id}:
 *   post:
 *     summary: Add a post to a user's favorite list
 *     description: >
 *       Allows a user to add a specific post to their list of favorite posts.  
 *       The post must exist, cannot already be favorited by the user, and users cannot favorite their own posts.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user performing the favorite action
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       description: Post information to be added to the user's favorite list
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *                 description: ID of the post to add to favorites
 *                 example: 12
 *     responses:
 *       200:
 *         description: Favorite post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating favorite creation
 *                   example: "Favorite post created successfully"
 *                 favoritePost:
 *                   $ref: '#/components/schemas/FavoritePost'
 *       400:
 *         description: Bad request - validation errors, post does not exist, post already favorited, or user trying to favorite own post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: List of error messages describing why the request failed
 *                   items:
 *                     type: string
 *                   example: ["Post not found", "Favorite post already exists", "Cannot favorite your own post"]
 *       404:
 *         description: Post or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error while creating favorite post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message from server
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