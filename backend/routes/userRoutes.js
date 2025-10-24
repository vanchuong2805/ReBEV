import express from 'express';
import registerUser from '../controllers/user/registerController.js';
import loginUserByPhone from '../controllers/user/loginPhoneController.js';
import loginUserByGoogle from '../controllers/user/loginGoogleController.js';
import getAll from '../controllers/user/getAllController.js';
import getUser from '../controllers/user/getUserController.js';
import updateUser from '../controllers/user/updateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import registerPackage from '../controllers/user/registerPackageController.js';
import updatePassword from '../controllers/user/updatePasswordController.js';
import authorize from '../middlewares/authorize.js';
import lockAccount from '../controllers/user/lockAccountController.js';
import unLockAccount from '../controllers/user/unLockAccountController.js';

const userRouter = express.Router();

/**
 * @swagger
 * tags:S
 *   name: Users
 *   description: API quản lý người dùng
 */

userRouter.get('/', getAll);
userRouter.get('/:id', getUser);
userRouter.post('/register', registerUser);
userRouter.post('/login/phone', loginUserByPhone);
userRouter.post('/login/google', loginUserByGoogle);
userRouter.put('/:id/update', authMiddleware, updateUser);
userRouter.post('/:user_id/register-package/:package_id', authMiddleware, registerPackage);
userRouter.put('/:id/update-password', authMiddleware, updatePassword);
userRouter.patch('/:user_id/lock-account', authMiddleware, authorize([1, 2]), lockAccount);
userRouter.patch('/:user_id/unlock-account', authMiddleware, authorize([1, 2]), unLockAccount);

export default userRouter;
