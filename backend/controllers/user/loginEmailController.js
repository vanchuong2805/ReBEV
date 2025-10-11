// import { ERROR_MESSAGE } from '../../config/constants.js';
// import { SUCCESS_MESSAGE } from '../../config/constants.js';
// import bcrypt from 'bcrypt';

// const loginUserByEmail = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (!email) {
//             return res.status(400).json(ERROR_MESSAGE.EMAIL_BLANK);
//         }
//         if (!password) {
//             return res.status(400).json(ERROR_MESSAGE.PASSWORD_BLANK);
//         }

//         const accountUser = await userService.getUserByEmail(email);

//         if (!accountUser) {
//             return res.status(404).json(ERROR_MESSAGE.EMAIL_PASSWORD_INCORRECT);
//         }

//         const isPasswordValid = await bcrypt.compare(password, accountUser.password);

//         if (!isPasswordValid) {
//             return res.status(401).json(ERROR_MESSAGE.EMAIL_PASSWORD_INCORRECT);
//         }

//         res.status(200).json({
//             message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
//             user: accountUser,
//         });
//     } catch (error) {
//         console.error(ERROR_MESSAGE.LOGIN_FAIL, error);
//         res.status(400).json({
//             error: error.message
//         })
//     }
// }
// export default loginUserByEmail;