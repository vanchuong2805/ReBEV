import favoritePostService from "../../services/favorite/favoritePostService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/favorites/delete/{post_id}:
 *   delete:
 *     summary: Delete a favorite post
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: ID of the post to delete from favorites
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite post deleted successfully
 *       400:
 *         description: Bad request
 */

const deleteFavorite = async (req, res) => {
    try {
        const {
            post_id,
        } = req.params;

        const favorite = await favoritePostService.getByPostId(post_id);

        if (!favorite) {
            return res.status(400).json({ errors: ERROR_MESSAGE.FAVORITE_NOT_FOUND });
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