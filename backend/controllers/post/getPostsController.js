import postService from '../../services/post/postService.js';

const getPosts = async (req, res) => {
    try {
        const posts = await postService.getAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve posts',
            error: error.message || 'Internal Server Error',
        });
    }
};

export default getPosts;
