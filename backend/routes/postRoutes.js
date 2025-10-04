import express from 'express';
import createController from '../controllers/post/createController.js';

const router = express.Router();

router.post('/', createController);

export default router;
