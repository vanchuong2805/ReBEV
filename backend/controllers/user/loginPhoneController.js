import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'
import bcrypt from 'bcrypt';
import jwtService from '../../services/auth/jwtService.js';

/**
 * @swagger
 * /api/users/login/phone:
 *   post:
 *     summary: Đăng nhập người dùng bằng số điện thoại
 *     description: API cho phép người dùng đăng nhập bằng **số điện thoại** và **mật khẩu**. Nếu đăng nhập thành công, trả về thông tin người dùng và token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     email:
 *                       type: string
 *                       example: "nguyenvana@gmail.com"
 *                     phone:
 *                       type: string
 *                       example: "0987654321"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     package_id:
 *                       type: integer
 *                       example: 3
 *                     package_start:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-29T10:00:00Z"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *       400:
 *         description: Thiếu thông tin đăng nhập hoặc lỗi dữ liệu đầu vào
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
 *                     - "Số điện thoại không được để trống"
 *                     - "Mật khẩu không được để trống"
 *       401:
 *         description: Mật khẩu không chính xác
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Số điện thoại hoặc mật khẩu không chính xác"
 *       403:
 *         description: Tài khoản đã bị khóa
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Tài khoản của bạn đã bị khóa"
 *       404:
 *         description: Không tìm thấy người dùng tương ứng với số điện thoại
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Số điện thoại hoặc mật khẩu không chính xác"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Đăng nhập thất bại do lỗi hệ thống"
 */

const loginUserByPhone = async (req, res) => {
    try {
        const {
            phone,
            password
        } = req.body
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

        if (accountUser.is_locked) {
            return res.status(403).json(ERROR_MESSAGE.ACCOUNT_LOCKED);
        }

        //Create access token and refresh token
        //Create payload
        const payload = {
            id: accountUser.id,
            display_name: accountUser.display_name,
            role: accountUser.role,
            avatar: accountUser.avatar,
            package_id: accountUser.package_id,
            package_start: accountUser.package_start,
        }

        const accessToken = jwtService.createAccessToken(payload);

        const refreshToken = await jwtService.createRefreshToken({ userId: accountUser.id });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        });

        const {
            password: pwd, ...userWithoutPassword
        } = accountUser.dataValues;

        res.status(200).json({
            message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
            user: userWithoutPassword,
            accessToken,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.LOGIN_FAIL, error);
        res.status(400).json({
            error: error.message
        })
    }
}

export default loginUserByPhone;