import express from 'express';
import userRouter from './userRoutes.js';
import { swaggerUi, swaggerSpec } from '../config/swagger.js';
import postRouter from './postRoutes.js';
import baseRouter from './baseRoutes.js';
import categoryRouter from './categoryRoutes.js';
import variationRouter from './variationRoutes.js';
import variationValueRouter from './variationValueRoutes.js';
import orderRouter from './orderRoutes.js';
import cartRouter from './cartRoutes.js';
import contactRouter from './contactRoutes.js';
import authRouter from './authRoutes.js';
import transactionRouter from './transactionRoutes.js';
import favoritePostRouter from './favoritePostRoutes.js';
import packageRoute from './packageRoutes.js';
import orderDetailRoute from './orderDetailRoutes.js';

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/bases', baseRouter);
router.use('/categories', categoryRouter);
router.use('/variations', variationRouter);
router.use('/variationValues', variationValueRouter);
router.use('/orders', orderRouter);
router.use('/carts', cartRouter);
router.use('/contacts', contactRouter);
router.use('/auth', authRouter);
router.use('/transactions', transactionRouter);
router.use('/favorites', favoritePostRouter);
router.use('/packages', packageRoute);
router.use('/order-details', orderDetailRoute);

export default router;
