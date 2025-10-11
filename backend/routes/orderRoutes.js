import express from 'express';
import createOrder from  '../controllers/order/createController.js';
const router = express.Router();

router.post('/', createOrder);

export default router;