import express from 'express';
import createReview from '../controllers/review/createReviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const orderDetailRoute = express.Router();

orderDetailRoute.post('/:user_id/review', authMiddleware, createReview);

export default orderDetailRoute;