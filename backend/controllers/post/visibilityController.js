import postService from '../../services/post/postService.js';

const visibilityController = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postService.getById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const isHidden = !post.is_hidden;
        await postService.changeVisibility(postId, isHidden);
        res.status(200).json({ message: `Post visibility updated to ${isHidden ? 'hidden' : 'visible'}` });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update post visibility',
            error: error.message || 'Internal Server Error',
        });
    }
};

export default visibilityController;
