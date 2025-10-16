import express from 'express';
import createOrder from  '../controllers/order/createController.js';
import getOrder from '../controllers/order/getOrderController.js';
import getOrders from '../controllers/order/getOrdersController.js';
import changeStatus from '../controllers/order/changeStatusController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.get('/', getOrders);
router.post('/:id/status', changeStatus);
export default router;