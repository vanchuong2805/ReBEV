import jwt from 'jsonwebtoken';
import userService from '../../services/user/userService.js';
import verifyGoogleToken from '../../services/auth/googleService.js';
import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';

/** 
 * @swagger
 * /api/users/login/google:
 *   post:
 *     summary: Login user with Google
 *     description: Login user with Google account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Account locked
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

        const { email, name, picture } = googleUser;

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