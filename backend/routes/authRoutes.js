import express from 'express';
import refreshTokenController from '../controllers/auth/refreshTokenController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng
 */

router.post('/refresh', refreshTokenController);

export default router;
