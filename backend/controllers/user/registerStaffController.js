import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/users/register-staff:
 *   post:
 *     summary: Register a new staff user
 *     description: |
 *       This API allows registering a **new staff user** with an email and optionally a phone number.  
 *       - If the email already exists, the API will return `400`.  
 *       - If the phone number already exists, the API will return `400`.  
 *       - If required fields are missing, the API will return `400`.  
 *       - On success, returns the newly created staff user information (without the password).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the staff user
 *                 example: "staff@example.com"
 *               phone:
 *                 type: string
 *                 description: Optional phone number of the staff user
 *                 example: "0912345678"
 *     responses:
 *       201:
 *         description: Staff user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Staff user created successfully"
 *                 user:
 *                   type: object
 *                   description: Newly created staff user information (without password)
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     display_name:
 *                       type: string
 *                       example: ""
 *                     email:
 *                       type: string
 *                       example: "staff@example.com"
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                       example: "0912345678"
 *                     role:
 *                       type: string
 *                       example: "STAFF"
 *                     is_locked:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid input or email/phone already exists
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
 *                     - "Email cannot be blank"
 *                     - "Phone number already exists"
 *       500:
 *         description: Internal server error while creating staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create staff user"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */


const registerStaff = async (req, res) => {
    try {
        const {
            email,
            phone
        } = req.body;
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

        const newUser = await userService.createStaff({
            display_name: "",
            email,
            phone
        });

        const {
            password,
            ...userWithoutPassword
        } = newUser.dataValues;

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
