import express from 'express';

import userRouter from './userRoutes.js';
import postRouter from './postRoutes.js';
import baseRouter from './baseRoutes.js';
import categoryRouter from './categoryRoutes.js';
import variationRouter from './variationRoutes.js';
import variationValueRouter from './variationValueRoutes.js';
import orderRouter from './orderRoutes.js';
import cartRouter from './cartRoutes.js';
const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/bases', baseRouter);
router.use('/categories', categoryRouter);
router.use('/variations', variationRouter);
router.use('/variationValues', variationValueRouter);
router.use('/orders', orderRouter);
router.use('/carts', cartRouter);

export default router;
