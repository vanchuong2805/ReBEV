import favoritePostService from "../../services/favorite/favoritePostService.js";
import postService from "../../services/post/postService.js";

/** 
 * @swagger
 * /api/favorites/{userId}:
 *   get:
 *     summary: Get favorite posts by user ID
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite posts retrieved successfully
 *       404:
 *         description: No favorite posts found
 */

const getFavorite = async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorite = await favoritePostService.getByUserId(userId);
        const response = { userId, favoritePosts: [] };
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