import express from 'express';
import createComplaint from '../controllers/complaint/createController.js';
import changeStatus from '../controllers/complaint/changeStatusController.js';
import getComplaints from '../controllers/complaint/getComplaintsController.js';    
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorize.js';
import { ROLE } from '../config/constants.js';

const router = express.Router();

router.post('/', authMiddleware, createComplaint);
router.get('/',authMiddleware, authorize([ROLE.ADMIN, ROLE.STAFF]), getComplaints);
router.patch('/:id/status', authMiddleware, changeStatus);



export default router;
