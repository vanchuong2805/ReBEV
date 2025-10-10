import express from 'express';
import getVariationValues from '../controllers/variation/getValuesController.js';

const router = express.Router();

router.get('/', getVariationValues);

export default router;