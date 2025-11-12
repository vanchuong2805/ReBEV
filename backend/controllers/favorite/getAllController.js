import favoritePostService from "../../services/favorite/favoritePostService.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FavoritePost:
 *       type: object
 *       description: Represents a favorite post marked by a user
 *       properties:
 *         user_id:
 *           type: integer
 *           description: ID of the user who favorited the post
 *           example: 1
 *         post_id:
 *           type: integer
 *           description: ID of the post that has been favorited
 *           example: 12
 * 
 * /api/favorites:
 *   get:
 *     summary: Retrieve all favorite posts
 *     description: >
 *       Fetch a list of all favorite posts in the system.  
 *       This endpoint allows optional filtering by `user_id` to retrieve favorites for a specific user.  
 *       Each favorite post record contains the ID of the user and the ID of the post they favorited.  
 *       This can be used to display a user's favorite posts in a profile or to analyze popular posts across all users.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         description: Optional filter to retrieve only favorite posts for a specific user ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Favorite posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Array of favorite post objects
 *               items:
 *                 $ref: '#/components/schemas/FavoritePost'
 *             examples:
 *               example-1:
 *                 summary: List of favorite posts for a user
 *                 value: [
 *                   { "user_id": 1, "post_id": 12 },
 *                   { "user_id": 1, "post_id": 15 },
 *                   { "user_id": 1, "post_id": 20 }
 *                 ]
 *       404:
 *         description: No favorite posts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Returned when no favorite posts exist for the system or the specific user filter
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No favorite posts found"
 *       500:
 *         description: Internal server error while retrieving favorite posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Returned when the server encounters an unexpected error
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *     security:
 *       - bearerAuth: []
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