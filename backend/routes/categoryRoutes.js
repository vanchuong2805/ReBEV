import express from 'express';
import getAllCategories from '../controllers/category/getAllController.js';

const router = express.Router();

router.get('/',getAllCategories);

export default router;