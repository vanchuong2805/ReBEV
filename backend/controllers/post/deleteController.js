import postService from '../../services/post/postService.js';

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
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export default deleteController;
