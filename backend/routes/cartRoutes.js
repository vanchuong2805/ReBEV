import express from 'express';
import createCart from '../controllers/cart/createCartController.js';
import getCart from '../controllers/cart/getCartController.js';
import getAll from '../controllers/cart/getAllController.js';
import deleteCart from '../controllers/cart/deleteCartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

/** 
 * @swagger
 * tags:
 *   name: Carts
 *   description: API quản lý giỏ hàng
 */

const cartRouter = express.Router();

cartRouter.post('/:user_id', authMiddleware, createCart);
cartRouter.get('/:user_id', authMiddleware, getCart);
cartRouter.get('/', getAll);
cartRouter.delete('/delete/:post_id', authMiddleware, deleteCart);

export default cartRouter;