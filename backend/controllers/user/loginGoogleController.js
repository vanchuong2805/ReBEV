import jwt from 'jsonwebtoken';
import userService from '../../services/user/userService.js';
import verifyGoogleToken from '../../services/auth/googleService.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import jwtService from '../../services/auth/jwtService.js';

/**
 * @swagger
 * /api/users/login/google:
 *   post:
 *     summary: Login user with Google
 *     description: |
 *       Allows users to login using their Google account.  
 *       - If the email does not exist in the system, a new user account will be automatically created.  
 *       - If the account is locked, returns 403.
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
 *                 description: JWT ID token from Google
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5Zj..."
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginGoogleSuccess'
 *             examples:
 *               success:
 *                 summary: Login success example
 *                 value:
 *                   message: "Login with Google successful"
 *                   user:
 *                     id: 12
 *                     display_name: "Nguyen Van A"
 *                     email: "vana@gmail.com"
 *                     role: 0
 *                     avatar: "https://lh3.googleusercontent.com/a/AEdFTp5..."
 *                     phone: "0901234567"
 *                     package_id: 2
 *                     package_start: "2025-10-01T07:00:00Z"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *       400:
 *         description: Invalid request or Google verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               invalidToken:
 *                 summary: Google token invalid
 *                 value:
 *                   error: "Invalid Google token"
 *               emailNotVerified:
 *                 summary: Email not verified
 *                 value:
 *                   error: "Google email is not verified"
 *
 *       403:
 *         description: Account is locked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *             examples:
 *               locked:
 *                 summary: Account locked
 *                 value:
 *                   error: "Account is locked"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               serverFail:
 *                 summary: Server error example
 *                 value:
 *                   error: "Failed to login with Google"
 *
 * components:
 *   schemas:
 *     LoginGoogleSuccess:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login with Google successful"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             display_name:
 *               type: string
 *               example: "Nguyen Van A"
 *             email:
 *               type: string
 *               example: "vana@gmail.com"
 *             role:
 *               type: integer
 *               example: 0
 *             avatar:
 *               type: string
 *               example: "https://lh3.googleusercontent.com/a/AEdFTp5..."
 *             phone:
 *               type: string
 *               nullable: true
 *               example: "0901234567"
 *             package_id:
 *               type: integer
 *               nullable: true
 *               example: 2
 *             package_start:
 *               type: string
 *               format: date-time
 *               example: "2025-10-01T07:00:00Z"
 *         token:
 *           type: string
 *           description: JWT access token valid for 1 hour
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Invalid Google token"
 *
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Account is locked"
 *
 *     ServerError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Failed to login with Google"
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
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: SUCCESS_MESSAGE.LOGIN_GOOGLE_SUCCESS,
            user: {
                id: user.id,
                display_name: user.display_name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone,
                package_id: user.package_id,
                package_start: user.package_start,
                create_at: user.create_at
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