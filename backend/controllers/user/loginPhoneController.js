import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'
import bcrypt from 'bcrypt';

const loginUserByPhone = async (req, res) => {
    try {
        const { phone, password } = req.body
        const errors = [];

        if (!phone) {
            errors.push(ERROR_MESSAGE.PHONE_BLANK);
        }
        if (!password) {
            errors.push(ERROR_MESSAGE.PASSWORD_BLANK);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                errors: errors
            });
        }

        const accountUser = await userService.getUserByPhone(phone);

        if (!accountUser) {
            return res.status(404).json(ERROR_MESSAGE.PHONE_PASSWORD_INCORRECT);
        }

        const isPasswordValid = await bcrypt.compare(password, accountUser.password);

        if (!isPasswordValid) {
            return res.status(401).json(ERROR_MESSAGE.PHONE_PASSWORD_INCORRECT);
        }


        res.status(200).json({
            message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
            user: accountUser,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.LOGIN_FAIL, error);
        res.status(400).json({
            error: error.message
        })
    }
}

export default loginUserByPhone;