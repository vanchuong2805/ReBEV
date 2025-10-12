import express from 'express';
import createCart from '../controllers/cart/createCartController.js';

const cartRouter = express.Router();

cartRouter.post('/:user_id', createCart);

export default cartRouter;