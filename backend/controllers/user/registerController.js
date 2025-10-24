import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'


/** 
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thông tin đăng ký không hợp lệ
 *       409:
 *         description: Số điện thoại đã tồn tại
 */

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

        const currentUser = req.user;

        let finalRole = 0; // Default role: regular user

        if (currentUser && currentUser.role === 2) {
            finalRole = role; // Admin can create another staff
        } else {
            finalRole = 0;
        }


        const newUser = await userService.createUser({
            display_name,
            phone,
            password,
            role: finalRole
        });

        const { password: pwd, ...userWithoutPassword } = newUser.dataValues;

        res.status(200).json({
            message: SUCCESS_MESSAGE.REGISTER_SUCCESS,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(ERROR_MESSAGE.REGISTER_FAIL, error);
        res.status(400).json({
            error: error.message
        });
    }
}

export default registerUser;

