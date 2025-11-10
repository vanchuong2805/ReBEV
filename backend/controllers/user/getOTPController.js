import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/get-otp:
 *   post:
 *     summary: Request OTP for password reset
 *     description: |
 *       This API allows a user to request a **One-Time Password (OTP)** for resetting their password using their registered phone number.  
 *       - No authentication is required.  
 *       - The OTP is a 6-digit numeric code generated randomly.  
 *       - If the phone number does not exist in the system, a **404 Not Found** response is returned.  
 *       - Input validation is performed; missing or invalid phone numbers return **400 Bad Request**.
 *     tags: [Users]
 *     operationId: getOTPPassword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetOTPRequest'
 *           examples:
 *             validRequest:
 *               summary: Valid phone number
 *               value:
 *                 phone: "0901234567"
 *             missingPhone:
 *               summary: Missing phone field
 *               value: {}
 *
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetOTPResponse'
 *             examples:
 *               success:
 *                 summary: Example successful response
 *                 value:
 *                   message: "OTP has been sent successfully"
 *                   otp: "483920"
 *
 *       400:
 *         description: Invalid phone number input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               invalidPhone:
 *                 summary: Invalid phone format
 *                 value:
 *                   message: "Invalid phone number format"
 *
 *       404:
 *         description: User not found with the provided phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               userNotFound:
 *                 summary: Phone number not registered
 *                 value:
 *                   message: "User not found"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               serverFailure:
 *                 summary: Database or server error
 *                 value:
 *                   message: "Server error"
 *                   error: "Database connection failed"
 *
 * components:
 *   schemas:
 *     GetOTPRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: string
 *           description: Registered phone number of the user
 *           example: "0901234567"
 *
 *     GetOTPResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "OTP has been sent successfully"
 *         otp:
 *           type: string
 *           description: 6-digit OTP code
 *           example: "483920"
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid phone number format"
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User not found"
 *
 *     ServerError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Server error"
 *         error:
 *           type: string
 *           example: "Database connection failed"
 */


const getOTPPassword = async (req, res) => {

    try {
        const { phone } = req.body;

        const user = await userService.getUserByPhone(phone);

        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND,
            });
        }
        const randomotp = Math.floor(100000 + Math.random() * 900000).toString();
        return res.status(200).json({
            message: SUCCESS_MESSAGE.OTP_SENT,
            otp: randomotp
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.FORGET_PASSWORD_FAILED,
            error: error.message
        });
    }

}

export default getOTPPassword;
