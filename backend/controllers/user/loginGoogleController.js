import jwt from 'jsonwebtoken';
import userService from '../../services/user/userService.js';
import verifyGoogleToken from '../../services/auth/googleService.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';

/**
 * @swagger
 * /api/users/login/google:
 *   post:
 *     summary: Đăng nhập người dùng bằng Google
 *     description: Cho phép người dùng đăng nhập bằng tài khoản Google. Nếu email chưa tồn tại trong hệ thống, tài khoản mới sẽ được tự động tạo.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_token
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Mã ID token từ Google (JWT)
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5Zj..."
 *     responses:
 *       200:
 *         description: Đăng nhập bằng Google thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login with Google successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     display_name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     email:
 *                       type: string
 *                       example: "vana@gmail.com"
 *                     role:
 *                       type: integer
 *                       example: 0
 *                     avatar:
 *                       type: string
 *                       example: "https://lh3.googleusercontent.com/a/AEdFTp5..."
 *                 token:
 *                   type: string
 *                   description: Mã JWT access token hợp lệ trong 1 giờ
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *       400:
 *         description: Dữ liệu yêu cầu không hợp lệ hoặc lỗi khi xác thực Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid Google token"
 *
 *       403:
 *         description: Tài khoản đã bị khóa, không thể đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Account is locked"
 *
 *       500:
 *         description: Lỗi máy chủ nội bộ khi đăng nhập bằng Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to login with Google"
 */

const loginUserByGoogle = async (req, res) => {
    try {
        const { id_token } = req.body;

        if (!id_token) {
            return res.status(400).json({
                error: ERROR_MESSAGE.GOOGLE_TOKEN_BLANK
            });
        }
        const googleUser = await verifyGoogleToken(id_token);

        if (!googleUser.email_verified) {
            return res.status(400).json({
                error: ERROR_MESSAGE.GOOGLE_EMAIL_NOT_VERIFIED
            });
        }

        const {
            email,
            name,
            picture
        } = googleUser;

        let user = await userService.getUserByEmail(email);

        if (!user) {
            user = await userService.createUser({
                display_name: name,
                email: email,
                phone: null,
                password: '',
            });

            user.avatar = picture;

            await user.save();

        }

        else {
            if (!user.display_name?.trim()) {
                user.display_name = name;
                user.avatar = picture;
                await user.save();
            }
        }

        if (user.is_locked) {
            return res.status(403).json(ERROR_MESSAGE.ACCOUNT_LOCKED);
        }


        const accessToken = jwt.sign({
            id: user.id,
            display_name: user.display_name,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        const refreshToken = await jwtService.createRefreshToken({ userId: user.id });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        });

        res.status(200).json({
            message: SUCCESS_MESSAGE.LOGIN_GOOGLE_SUCCESS,
            user: {
                id: user.id,
                display_name: user.display_name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
            token: accessToken,
        });

    } catch (error) {
        console.error(ERROR_MESSAGE.LOGIN_GOOGLE_FAIL, error);
        res.status(400).json({
            error: ERROR_MESSAGE.LOGIN_GOOGLE_FAIL
        });
    }

}

export default loginUserByGoogle;