import postService from '../../services/post/postService.js';
import { POST_STATUS, TRANSITION_STATUS } from '../../config/constants.js';

/** 
 * @swagger
 * /api/posts/{id}/change-status:
 *   put:
 *     summary: Change post status
 *     description: Update the status of a specific post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: The new status for the post
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Post status updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Post not found
 *       403:
 *         description: Forbidden
 */

const changeStatusController = async (req, res) => {
    try {
        const postId = req.params.id;
        const status = req.body.status;
        if (status === undefined) {
            return res.status(400).json({ message: 'Status is required.' });
        }
        const post = await postService.getById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        const allowed = TRANSITION_STATUS[status];
        if (!allowed || !allowed?.includes(post.status)) {
            return res.status(400).json({ message: 'Cannot change post status.' });
        }
        await postService.updateStatus(postId, { status, moderator: req.user.id });
        res.status(200).json({ message: 'Post status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

export default changeStatusController;
