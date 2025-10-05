import postService from '../../services/post/postService.js';
import { POST_STATUS } from '../../config/constants.js';
import postStatusService from '../../services/post/postStatusService.js';

const rejectController = async (req, res) => {
    try {
        const { postId } = req.params;
        const { description } = req.body;
        if (!postId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const post = await postService.getById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const { status: currentStatus } = await postStatusService.getCurrent(postId);

        if (currentStatus !== POST_STATUS.PENDING) {
            return res.status(400).json({ message: 'Cannot reject post that is not pending' });
        }

        const newStatus = await postStatusService.create({
            post_id: postId,
            status: POST_STATUS.REJECTED,
            description
        });
        res.status(200).json(newStatus);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

export default rejectController;
