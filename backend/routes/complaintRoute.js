import express from 'express';
import createComplaint from '../controllers/complaint/createController.js';
import changeStatus from '../controllers/complaint/changeStatusController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createComplaint);
router.patch('/:id/status', authMiddleware, changeStatus);



export default router;
