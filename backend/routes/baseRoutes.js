import express from 'express';
import getAllBases from  '../controllers/base/getAllController.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Bases
 *   description: API quản lý các base
 */

router.get('/', getAllBases);

export default router;