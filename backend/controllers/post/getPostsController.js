import postService from '../../services/post/postService.js';
// iUser_id=5&province_id=201&order_by=price&order_direction=ASC&is_deleted=false&is_hidden=false&variation_value_id=1&variation_value_id=11&min_price=200000&max_price=5000000
/**
 * @swagger
 * path:
 *  /api/posts:
 *   get:
 *     summary: Get a list of posts
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: variation_value_ids
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *      - in: query
 *         name: min_price
 *         schema:
 *           type: integer
 *      - in: query
 *         name: max_price
 *         schema:
 *           type: integer
 *      - in: query
 *         name: order_by    
 *         schema:
 *           type: string
 *         enum:
 *           - price
 *           - create_at
 *      - in: query
 *         name: order_direction
 *         schema:
 *           type: string
 *         enum:
 *           - ASC
 *           - DESC
 *      - in: query
 *         name: is_deleted
 *         schema:
 *           type: boolean
 *      - in: query
 *         name: is_hidden
 *         schema:
 *           type: boolean
 *      - in: query
 *         name: iUser_id
 *         schema: 
 *           type: integer
 *      - in: query
 *         name: province_id
 *         schema:
 *           type: integer
 *      - in: query
 *         name: variation_value_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal Server Error
 */

const getPosts = async (req, res) => {
    try {
        const filters = req.query;
        const posts = await postService.getPosts(filters);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve posts',
            error: error.message || 'Internal Server Error',
        });
    }
};

export default getPosts;
