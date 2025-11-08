import express from 'express';
import createReview from '../controllers/review/createReviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorize.js';
import uploadContractFileController from '../controllers/order/uploadContractFileController.js';
import updateAppointmentTime from '../controllers/order/updateAppointmentController.js';
import { ROLE } from '../config/constants.js';

const orderDetailRoute = express.Router();

orderDetailRoute.post('/:user_id/review', authMiddleware, createReview);
orderDetailRoute.patch(
    '/:id/contract',
    authMiddleware,
    authorize([ROLE.ADMIN, ROLE.STAFF]),
    uploadContractFileController
);
orderDetailRoute.put(
    '/:orderId/appointmentTime',
    authMiddleware,
    updateAppointmentTime
);


export default orderDetailRoute;
