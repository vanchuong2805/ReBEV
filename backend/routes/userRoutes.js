import express from 'express';
import registerUser from '../controllers/user/registerController.js';
import loginUserByPhone from '../controllers/user/loginPhoneController.js';
import loginUserByGoogle from '../controllers/user/loginGoogleController.js';
import getAll from '../controllers/user/getAllController.js';
import getUser from '../controllers/user/getUserController.js';
import updateUser from '../controllers/user/updateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import registerPackage from '../controllers/user/registerPackageController.js';

const userRouter = express.Router();

userRouter.get('/', getAll);
userRouter.get('/:id', getUser);
userRouter.post('/register', registerUser);
userRouter.post('/login/phone', loginUserByPhone);
userRouter.post('/login/google', loginUserByGoogle);
userRouter.put('/:id/update', authMiddleware, updateUser);
userRouter.post('/:user_id/register-package/:package_id', authMiddleware, registerPackage);

export default userRouter;
