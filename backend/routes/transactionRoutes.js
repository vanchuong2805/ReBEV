import express from 'express';
import createOrderTransaction from '../controllers/transaction/createOrderTransactionController.js';
import createPackageTransaction from '../controllers/transaction/createPackageTransactionController.js';
const router = express.Router();
router.post('/', createOrderTransaction);
router.post('/package', createPackageTransaction);
export default router;