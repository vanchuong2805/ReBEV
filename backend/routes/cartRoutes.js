import express from 'express';
import createCart from '../controllers/cart/createCartController.js';
import getCart from '../controllers/cart/getAllController.js';
import deleteCart from '../controllers/cart/deleteCartController.js';

const cartRouter = express.Router();

cartRouter.post('/:user_id', createCart);
cartRouter.get('/:user_id', getCart);
cartRouter.delete('/delete/:post_id', deleteCart);

export default cartRouter;