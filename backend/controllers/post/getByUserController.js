import postService from '../../services/post/postService.js';

/**
 * @swagger
 * /api/users/{id}/posts:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

const getPosts = async (req, res) => {
    try {
        const { id } = req.params;
        if (id != req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const posts = await postService.getByUserId(id);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
        });
    }
};

export default getPosts;
