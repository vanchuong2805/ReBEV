// import postService from '../../services/post/postService.js';

// const visibilityController = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const { is_hidden } = req.body;
//         if (!postId || is_hidden === undefined) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }
//         const post = await postService.getById(postId);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         await postService.changeVisibility(postId, { is_hidden });
//         res.status(200).json({ message: 'Post visibility updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };

// export default visibilityController;
