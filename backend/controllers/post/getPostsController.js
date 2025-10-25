import postService from '../../services/post/postService.js';

/**
 * @swagger
 * /api/posts:
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
