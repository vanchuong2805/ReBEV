import favoritePostService from "../../services/favorite/favoritePostService.js";

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
        if (!favorite) {
            return res.status(404).json({ error: "Favorite post not found" });
        }
        res.status(200).json(favorite);
    } catch (error) {
        console.error("Error fetching favorite posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default getFavorite;