import express from 'express';

import userRouter from './userRoutes.js';
import postRouter from './postRoutes.js';
import baseRouter from './baseRoutes.js';
import categoryRouter from './categoryRoutes.js';
import variationRouter from './variationRoutes.js';
import variationValueRouter from './variationValueRoutes.js';
const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/bases', baseRouter);
router.use('/categories', categoryRouter);
router.use('/variations', variationRouter);
router.use('/variationValues', variationValueRouter);

export default router;
