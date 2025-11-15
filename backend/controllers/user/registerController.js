import { ERROR_MESSAGE } from '../../config/constants.js';
import { SUCCESS_MESSAGE } from '../../config/constants.js';
import userService from '../../services/user/userService.js'


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Allows a new user to register using **display name, phone, and password**.  
 *       - If the phone number already exists, returns `409 Conflict`.  
 *       - If input data is invalid or missing, returns `400 Bad Request`.
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
 *                 description: User's display name
 *                 example: "Nguyen Van A"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "0901234567"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: User registered successfully
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
 *         description: Invalid input or missing required fields
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
 *         description: Phone number already exists
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
 *         description: Internal server error
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

