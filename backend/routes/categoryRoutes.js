import express from 'express';
import getAllCategories from '../controllers/category/getAllController.js';
import updateRateById from '../controllers/category/updateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorize.js';
import { ROLE } from '../config/constants.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API quản lý các danh mục
 */
router.get('/', getAllCategories);
router.put('/:id/rate', authMiddleware, authorize(ROLE.ADMIN), updateRateById);

export default router;