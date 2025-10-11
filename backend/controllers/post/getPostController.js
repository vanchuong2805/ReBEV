import postService from '../../services/post/postService.js';

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
            message: 'Failed to retrieve posts',
            error: error.message || 'Internal Server Error',
        });
    }
};

export default getPost;
