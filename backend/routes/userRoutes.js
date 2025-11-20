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
import getPosts from '../controllers/post/getByUserController.js';
import authorize from '../middlewares/authorize.js';
import lockAccount from '../controllers/user/lockAccountController.js';
import unLockAccount from '../controllers/user/unLockAccountController.js';
import registerStaff from '../controllers/user/registerStaffController.js';
import logout from '../controllers/user/logoutController.js';
import forgetPassword from '../controllers/user/forgetPasswordController.js';
import getOTPPassword from '../controllers/user/getOTPController.js';
import getByUser from '../controllers/complaint/getByUserController.js';
import getTransactionByUser from '../controllers/transaction/getByUserController.js';
import withdrawController from '../controllers/user/withdrawController.js';
import getStatistics from '../controllers/user/statisticsController.js';
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

userRouter.get('/', getAll);
userRouter.get('/:id', getUser);
userRouter.post('/register', registerUser);
userRouter.post('/register-staff', authMiddleware, authorize([2]), registerStaff);
userRouter.post('/login/phone', loginUserByPhone);
userRouter.post('/login/google', loginUserByGoogle);
userRouter.put('/:id/update', authMiddleware, updateUser);
userRouter.post('/:user_id/register-package/:package_id', authMiddleware, registerPackage);
userRouter.put('/:id/update-password', authMiddleware, updatePassword);
userRouter.post('/get-otp', getOTPPassword);
userRouter.post('/forget-password', forgetPassword);
userRouter.get('/:id/posts', authMiddleware, getPosts);
userRouter.patch('/:user_id/lock-account', authMiddleware, authorize([1, 2]), lockAccount);
userRouter.patch('/:user_id/unlock-account', authMiddleware, authorize([1, 2]), unLockAccount);
userRouter.post('/logout', authMiddleware, logout);
userRouter.get('/:id/complaints', authMiddleware, getByUser);
userRouter.get('/:id/transactions', authMiddleware, getTransactionByUser);
userRouter.post('/:id/withdraw', authMiddleware, withdrawController);
userRouter.get('/:user_id/statistics', authMiddleware, getStatistics);

export default userRouter;
