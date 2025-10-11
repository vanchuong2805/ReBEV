// import postService from '../../services/post/postService.js';

// const deleteController = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         if (!postId) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }
//         const post = await postService.getById(postId);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         await postService.deletePost(postId);
//         res.status(200).json({ message: 'Post deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };

// export default deleteController;
