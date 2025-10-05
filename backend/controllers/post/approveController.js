import postService from '../../services/post/postService.js';
import { POST_STATUS } from '../../config/constants.js';
import postStatusService from '../../services/post/postStatusService.js';

const approveController = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const post = await postService.getById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const { status: currentStatus } = await postStatusService.getCurrent(postId);

        if (currentStatus !== POST_STATUS.PENDING) {
            return res.status(400).json({ message: 'Cannot approve post that is not pending' });
        }

        const newStatus = await postStatusService.create({
            post_id: postId,
            status: POST_STATUS.APPROVED,
        });
        res.status(200).json(newStatus);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

export default approveController;
