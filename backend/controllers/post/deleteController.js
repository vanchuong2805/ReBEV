import postService from '../../services/post/postService.js';

/**
 * @swagger
 * /posts/{id}:
 *  delete:
 *    summary: Xóa bài đăng
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID của bài đăng cần xóa
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Bài đăng đã xóa
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: Bài đăng không tồn tại
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 'Post not found'
 *      403:
 *        description: Người dùng không có quyền xóa bài đăng này
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 'Forbidden'
 *      500:
 *        description: Lỗi máy chủ nội bộ
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 'Server error'
 */

const deleteController = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const post = await postService.getById(id);
        if (!post || post.is_deleted) {
            return res.status(404).json({ message: 'Post not found' });
        } else {
            if (post.user_id !== user.id ){
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        await postService.deletePost(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export default deleteController;
