import express from 'express';
import createPost from '../controllers/post/createController.js';
import getPosts from '../controllers/post/getPostsController.js';
import getPost from '../controllers/post/getPostController.js';
import deleteController from '../controllers/post/deleteController.js';
import visibilityController from '../controllers/post/visibilityController.js';
import changeStatusController from '../controllers/post/changeStatusController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorize.js';
import { ROLE } from '../config/constants.js';
const router = express.Router();

router.post('/', authMiddleware, authorize(ROLE.MEMBER), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.patch('/:id/visibility', authMiddleware, visibilityController);
router.patch('/:id/delete', authMiddleware, deleteController);
router.patch('/:id/status', authMiddleware, authorize([ROLE.ADMIN, ROLE.STAFF]), changeStatusController);
export default router;
