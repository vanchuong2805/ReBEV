import postService from '../../services/post/postService.js';

/**
 * @swagger
 * /api/posts/{id}:
 *  get:
 *    summary: Lấy thông tin bài đăng theo ID
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID của bài đăng cần lấy thông tin
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Một bài đăng
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description:  Bài đăng không tồn tại
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 'Post not found'
 * */
const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postService.getById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
    }
};

export default getPost;
