import express from 'express';
import createOrderTransaction from '../controllers/transaction/createController.js';
const router = express.Router();
router.post('/', createOrderTransaction);
export default router;