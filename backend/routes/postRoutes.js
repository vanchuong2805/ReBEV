import express from 'express';
import createController from '../controllers/post/createController.js';
import approveController from '../controllers/post/approveController.js';
import rejectController from '../controllers/post/rejectController.js';

const router = express.Router();

router.post('/', createController);
router.post('/:postId/approve', approveController);
router.post('/:postId/reject', rejectController);

export default router;
