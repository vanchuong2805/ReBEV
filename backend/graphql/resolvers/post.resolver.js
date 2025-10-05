import postStatusService from '../../services/post/postStatusService.js';
import postMediaService from '../../services/post/postMediaService.js';
import postService from '../../services/post/postService.js';
import postDetailService from '../../services/post/postDetailService.js';
const postResolver = {
    Query: {
        postMedia: (_, { postID }) => postMediaService.getByPostId(postID),
        postStatus: (_, { postID }) => postStatusService.getByPostId(postID),
        postDetails: (_, { postID }) => postDetailService.getByPostId(postID),
        posts: postService.getAll,
        post: (_, { id }) => postService.getById(id),
    },
    Post: {
        media: (parent) => postMediaService.getByPostId(parent.id),
        status: (parent) => postStatusService.getByPostId(parent.id),
        details: (parent) => postDetailService.getByPostId(parent.id),
        currentStatus: (parent) => postStatusService.getCurrent(parent.id),
    },
};

export default postResolver;
