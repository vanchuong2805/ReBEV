import { POST_STATUS } from '../../config/constants.js';
import postService from '../../services/post/postService.js';
/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *    summary: Update a post
 *    description: Update the details of a specific post
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the post to update
 *        schema:
 *          type: integer
 *      - in: body
 *        name: body
 *        required: true
 *        description: The updated post data
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            price:
 *              type: number
 *   responses:
 *     200:
 *       description: Post updated successfully
 *     404:
 *       description: Post not found
 *     403:
 *       description: Forbidden
 */
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { title, description, price } = req.body;
        const post = await postService.getById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.user_id !== userId || post.is_deleted || post.status !== POST_STATUS.PENDING) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price !== undefined) updateData.price = price;

        await postService.updatePost(postId, updateData);
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error });
    }
};

export default updatePost;
