import postService from '../../services/post/postService.js';
import { POST_STATUS, TRANSITION_STATUS } from '../../config/constants.js';
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
            return res.status(400).json({ message: 'Cannot change post status.'});
        }
        await postService.updateStatus(postId, status);
        res.status(200).json({ message: 'Post status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to change post status.', error: error.message });
    }
};

export default changeStatusController;
