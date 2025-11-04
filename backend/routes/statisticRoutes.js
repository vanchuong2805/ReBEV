import express from 'express';
import getStatistic from '../controllers/admin/statisticsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/authorize.js';
import { ROLE } from '../config/constants.js';

const statisticRoutes = express.Router();

statisticRoutes.get('/', authMiddleware, authorize(ROLE.ADMIN), getStatistic);

export default statisticRoutes;