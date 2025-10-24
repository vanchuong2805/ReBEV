import express from 'express';
import getVariations from '../controllers/variation/getVariationsController.js';

const router = express.Router();

router.get('/', getVariations);

export default router;