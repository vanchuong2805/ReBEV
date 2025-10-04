import postStatusService from "../../services/postStatusService.js";
import postMediaService from "../../services/postMediaService";
import postService from "../../services/postService.js";
const postResolver = {
  Query: {
    postMedia : (_, { postId }) => postMediaService.getByPostId(postId),
    postStatus: (_, { postId }) => postStatusService.getByPostId(postId),
    posts: postService.getAll,
    post: (_, { id }) => postService.getById(id),
  },
  Post:{
    postMedia: (parent) => postMediaService.getByPostId(parent.id),
    postStatus: (parent) => postStatusService.getByPostId(parent.id),
  }
};

export default postResolver;