import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

const registerStaff = async (req, res) => {
    try {
        const { display_name, email, phone, password } = req.body;
        const errors = [];
        const existedEmail = await userService.getUserByEmail(email);
        const existedPhone = await userService.getUserByPhone(phone);

        if (!display_name) {
            errors.push(ERROR_MESSAGE.DISPLAY_NAME_BLANK);
        }

        if (!email) {
            errors.push(ERROR_MESSAGE.EMAIL_BLANK);
        }

        if (!password) {
            errors.push(ERROR_MESSAGE.PASSWORD_BLANK);
        }

        if (existedEmail) {
            errors.push(ERROR_MESSAGE.EMAIL_EXIST);
        }

        if (existedPhone) {
            errors.push(ERROR_MESSAGE.PHONE_EXIST);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                message: ERROR_MESSAGE.CREATE_STAFF_FAIL,
                errors
            });
        }

        const newStaff = await userService.createStaff({
            display_name,
            email,
            phone,
            password,
        });

        const { password: pwd, ...userWithoutPassword } = newStaff.dataValues;

        res.status(200).json({
            message: SUCCESS_MESSAGE.CREATE_STAFF_SUCCESS,
            user: userWithoutPassword,
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.CREATE_STAFF_FAIL,
            error: error.message
        });
    }
}

export default registerStaff;