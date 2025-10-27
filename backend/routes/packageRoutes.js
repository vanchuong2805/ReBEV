import express from 'express';
import getAll from '../controllers/package/getAllController.js';
import createPackage from '../controllers/package/createController.js';
import deletePackage from '../controllers/package/deleteController.js';
import updatePackage from '../controllers/package/updateController.js';

const packageRoute = express.Router();

packageRoute.get('/', getAll);
packageRoute.post('/create', createPackage);
packageRoute.patch('/:id/delete', deletePackage);
packageRoute.put('/:id/update', updatePackage);

export default packageRoute;