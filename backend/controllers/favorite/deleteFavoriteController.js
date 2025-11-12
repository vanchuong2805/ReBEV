import favoritePostService from "../../services/favorite/favoritePostService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

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
 * /api/favorites/delete/{post_id}:
 *   delete:
 *     summary: Remove a post from a user's favorite list
 *     description: >
 *       This endpoint allows a user to remove a specific post from their favorite list.  
 *       The post must exist in the user's favorites; otherwise, deletion will fail.  
 *       Deletion is permanent and cannot be undone.  
 *       This operation helps users manage their favorites and keep the list up to date.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The ID of the post to remove from the user's favorites
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Favorite post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Returns the details of the deleted favorite post along with a success message
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the deletion was successful
 *                   example: "Favorite post deleted successfully"
 *                 favorite:
 *                   $ref: '#/components/schemas/FavoritePost'
 *             examples:
 *               deletedFavorite:
 *                 summary: Example of a successfully deleted favorite post
 *                 value:
 *                   message: "Favorite post deleted successfully"
 *                   favorite:
 *                     user_id: 1
 *                     post_id: 12
 *       400:
 *         description: Bad request - post does not exist in favorites or other validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Returned when deletion cannot proceed due to invalid input or missing favorite
 *               properties:
 *                 errors:
 *                   type: string
 *                   description: Explains why the deletion failed
 *                   example: "Favorite not found"
 *       404:
 *         description: Favorite post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Returned when the favorite post cannot be located in the system
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the resource was not found
 *                   example: "Favorite post not found"
 *       500:
 *         description: Internal server error while attempting to delete the favorite post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Returned when the server encounters an unexpected error
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Details of the server-side error
 *                   example: "DELETE_FAVORITE_FAIL"
 *     security:
 *       - bearerAuth: []
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