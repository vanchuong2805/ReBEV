import userService from '../services/user/userService.js';
import { ERROR_MESSAGE } from '../constants/message.js';
import { SUCCESS_MESSAGE } from '../constants/message.js';


export const registerUser = async (req, res) => {
    try {
        const { display_name, email, password, phone } = req.body;
        const existedEmail = await userService.getUserByEmail(email);
        const existedPhone = await userService.getUserByPhone(phone);

        if (!email) {
            return res.status(400).send(ERROR_MESSAGE.EMAIL_BLANK);
        }
        if (!phone) {
            return res.status(400).send(ERROR_MESSAGE.PHONE_BLANK);
        }
        if (!password) {
            return res.status(400).send(ERROR_MESSAGE.PASSWORD_BLANK);
        }

        if (existedEmail) {
            return res.status(409).send(ERROR_MESSAGE.EMAIL_EXIST);
        }
        if (existedPhone) {
            return res.status(409).send(ERROR_MESSAGE.PHONE_EXIST);
        }

        const newUser = await userService.createUser({ display_name, email, phone, password });

        res.status(200).json({
            message: SUCCESS_MESSAGE.REGISTER_SUCCESS,
            user: newUser,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.REGISTER_FAIL, error);
        res.status(400).json({
            error: error.message
        })
    }
}

export default registerUser;

