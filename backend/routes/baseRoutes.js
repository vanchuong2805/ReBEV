import express from 'express';
import getAllBases from  '../controllers/base/getAllController.js';
const router = express.Router();

router.get('/', getAllBases);

export default router;