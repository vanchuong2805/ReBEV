import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/users/register-staff:
 *   post:
 *     summary: Register a new staff member
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 format: phone
 *     responses:
 *       201:
 *         description: Staff member registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const registerStaff = async (req, res) => {
    try {
        const { email, phone } = req.body;
        const error = [];

        if (!email) {
            error.push(ERROR_MESSAGE.EMAIL_BLANK);
        }

        if (error.length > 0) {
            return res.status(400).json({ errors: error });
        }

        if (phone) {
            const existingUser = await userService.getUserByPhone(phone);
            if (existingUser) {
                return res.status(400).json({
                    message: ERROR_MESSAGE.PHONE_EXISTS
                });
            }
        }

        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: ERROR_MESSAGE.EMAIL_EXISTS
            });
        }

        const newUser = await userService.createStaff({ display_name: "", email, phone });
        const { password, ...userWithoutPassword } = newUser.dataValues;

        return res.status(201).json({
            message: SUCCESS_MESSAGE.CREATE_STAFF_SUCCESS,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: ERROR_MESSAGE.CREATE_STAFF_FAIL,
            error: error.message
        });
    }
};

export default registerStaff;
