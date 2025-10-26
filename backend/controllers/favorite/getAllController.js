import favoritePostService from "../../services/favorite/favoritePostService.js";

/** 
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorite posts
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Favorite posts retrieved successfully
 *       404:
 *         description: No favorite posts found
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