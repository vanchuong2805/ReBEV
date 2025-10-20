import express from 'express';
import registerUser from '../controllers/user/registerController.js';
import loginUserByPhone from '../controllers/user/loginPhoneController.js';
import loginUserByGoogle from '../controllers/user/loginGoogleController.js';
import getAll from '../controllers/user/getAllController.js';
import getUser from '../controllers/user/getUserController.js';

const userRouter = express.Router();

userRouter.get('/', getAll);
userRouter.get('/:id', getUser);
userRouter.post('/register', registerUser);
userRouter.post('/login/phone', loginUserByPhone);
userRouter.post('/login/google', loginUserByGoogle);


export default userRouter;
