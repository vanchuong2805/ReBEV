import express from 'express';
import getAll from '../controllers/package/getAllController.js';

const packageRoute = express.Router();

packageRoute.get('/', getAll);

export default packageRoute;