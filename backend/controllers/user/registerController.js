import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     description: API cho phép người dùng đăng ký tài khoản mới bằng **họ tên, số điện thoại và mật khẩu**.  
 *       - Nếu số điện thoại đã tồn tại trong hệ thống, trả về lỗi `409`.  
 *       - Nếu dữ liệu không hợp lệ (thiếu hoặc trống), trả về lỗi `400`.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - display_name
 *               - phone
 *               - password
 *             properties:
 *               display_name:
 *                 type: string
 *                 description: Tên hiển thị của người dùng
 *                 example: "Nguyen Van A"
 *               phone:
 *                 type: string
 *                 description: Số điện thoại của người dùng
 *                 example: "0901234567"
 *               password:
 *                 type: string
 *                 description: Mật khẩu đăng nhập
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register user successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ hoặc thiếu thông tin bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Display name cannot be blank"
 *                     - "Phone cannot be blank"
 *                     - "Password cannot be blank"
 *       409:
 *         description: Số điện thoại đã tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Phone already exists"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to register user"
 */

const registerUser = async (req, res) => {
    try {
        const {
            display_name,
            password,
            phone
        } = req.body;

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

        if (errors.length > 0) {
            return res.status(400).json({
                errors: errors
            });
        }

        const newUser = await userService.createUser({
            display_name,
            phone,
            password,
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

