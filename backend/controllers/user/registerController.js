import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'


const registerUser = async (req, res) => {
    try {
        const { display_name, password, phone } = req.body;
        const existedPhone = await userService.getUserByPhone(phone);
        const errors = [];

        if (!display_name) {
            errors.push(ERROR_MESSAGE.DISPLAY_NAME_BLANK);
        }

        if (!phone) {
            errors.push(ERROR_MESSAGE.PHONE_BLANK);
        }
        if (!password) {
            errors.push(ERROR_MESSAGE.PASSWORD_BLANK);
        }

        if (existedPhone) {
            errors.push(ERROR_MESSAGE.PHONE_EXIST);
        }
        console.log(existedPhone);
        if (errors.length > 0) {
            return res.status(400).json({
                errors: errors
            });
        }

        const newUser = await userService.createUser({ display_name, phone, password });

        res.status(200).json({
            message: SUCCESS_MESSAGE.REGISTER_SUCCESS,
            user: newUser,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.REGISTER_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default registerUser;

