import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'
import bcrypt from 'bcrypt';
import jwtService from '../../services/auth/jwtService.js';

/**
 * @swagger
 * /api/users/login/phone:
 *   post:
 *     summary: Đăng nhập bằng số điện thoại
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Thông tin đăng nhập không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       401:
 *         description: Mật khẩu không đúng
 *       403:
 *         description: Tài khoản bị khóa
 */

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

        const { password: pwd, ...userWithoutPassword } = accountUser.dataValues;

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