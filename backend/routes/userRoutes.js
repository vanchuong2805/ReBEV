import express from 'express';
import registerUser from '../controllers/user/registerController.js';
import loginUserByPhone from '../controllers/user/loginPhoneController.js';
import loginUserByGoogle from '../controllers/user/loginGoogleController.js';
import loginUserByEmail from '../controllers/user/loginEmailController.js';
import addUserContactDetail from '../controllers/user/addContactController.js';
import updateContact from '../controllers/user/updateContactController.js';
import deleteContact from '../controllers/user/deleteContactController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login/phone', loginUserByPhone);
userRouter.post('/login/email', loginUserByEmail);
userRouter.post('/login/google', loginUserByGoogle);
userRouter.post('/contact-details', addUserContactDetail);
userRouter.put('/update/contact-details', updateContact);
userRouter.delete('/delete/contact-details', deleteContact);

export default userRouter;
