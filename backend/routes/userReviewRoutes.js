import updateReview from "../controllers/review/updateReviewController.js";
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const userReviewRoute = express.Router();

/** 
 * @swagger
 * tags:
 *   name: User Reviews
 *   description: User review management and retrieval
 */

userReviewRoute.put('/:review_id', authMiddleware, updateReview);

export default userReviewRoute;
