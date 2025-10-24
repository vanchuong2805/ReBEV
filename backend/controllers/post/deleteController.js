import postService from '../../services/post/postService.js';

const deleteController = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postService.getById(id);
        if (!post || post.is_deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log('ok');
        await postService.deletePost(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export default deleteController;
