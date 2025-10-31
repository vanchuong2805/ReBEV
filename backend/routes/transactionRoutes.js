import express from 'express';
import createOrderTransaction from '../controllers/transaction/createOrderTransactionController.js';
const router = express.Router();
router.post('/', createOrderTransaction);
export default router;