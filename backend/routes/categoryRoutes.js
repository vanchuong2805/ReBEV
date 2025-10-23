import express from 'express';
import getAllCategories from '../controllers/category/getAllController.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API quản lý các danh mục
 */
router.get('/',getAllCategories);

export default router;