import express from 'express';
import createPost from '../controllers/post/createController.js';
import getPosts from '../controllers/post/getPostsController.js';
import getPost from '../controllers/post/getPostController.js';
import deleteController from '../controllers/post/deleteController.js';
import visibilityController from '../controllers/post/visibilityController.js';
import changeStatusController from '../controllers/post/changeStatusController.js';
const router = express.Router();

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.patch('/:id/visibility', visibilityController);
router.patch('/:id/delete', deleteController);
router.patch('/:id/status', changeStatusController);
export default router;
