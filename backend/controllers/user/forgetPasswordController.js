import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";
import userService from "../../services/user/userService.js";

/**
 * @swagger
 * /api/users/forget-password:
 *   post:
 *     summary: Reset user password using registered phone number
 *     description: |
 *       This API allows a user to **reset their password** using their **registered phone number**.
 *       - No authentication is required to access this endpoint.  
 *       - The new password will be **hashed using bcrypt** before storing in the database.  
 *       - If the phone number does not exist in the system, a **404 Not Found** response will be returned.  
 *       - Input validation is performed; missing or invalid fields return **400 Bad Request**.
 *     tags: [Users]
 *     operationId: forgetPassword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordRequest'
 *           examples:
 *             validRequest:
 *               summary: Valid password reset request
 *               value:
 *                 phone: "0901234567"
 *                 newPassword: "NewPassword123!"
 *             missingPhone:
 *               summary: Missing phone number
 *               value:
 *                 newPassword: "NewPassword123!"
 *
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgetPasswordResponse'
 *             examples:
 *               success:
 *                 summary: Successful password reset
 *                 value:
 *                   message: "Password has been reset successfully"
 *
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               missingFields:
 *                 summary: Missing required fields
 *                 value:
 *                   message: "Invalid input data"
 *                   errors:
 *                     - "Phone is required"
 *                     - "Password must be at least 8 characters"
 *               invalidFormat:
 *                 summary: Invalid phone number format
 *                 value:
 *                   message: "Invalid input data"
 *                   errors:
 *                     - "Phone number format is invalid"
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
 *               dbFailure:
 *                 summary: Database or server error
 *                 value:
 *                   message: "Reset password failed"
 *                   error: "Database connection failed"
 *
 * components:
 *   schemas:
 *     ForgetPasswordRequest:
 *       type: object
 *       required:
 *         - phone
 *         - newPassword
 *       properties:
 *         phone:
 *           type: string
 *           description: Registered phone number of the user
 *           example: "0901234567"
 *         newPassword:
 *           type: string
 *           description: New password (minimum 8 characters)
 *           minLength: 8
 *           example: "NewPassword123!"
 *
 *     ForgetPasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Password has been reset successfully"
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid input data"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Phone is required", "Password must be at least 8 characters"]
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
 *           example: "Reset password failed"
 *         error:
 *           type: string
 *           example: "Database connection failed"
 */

const forgetPassword = async (req, res) => {
    try {
        const {
            phone,
            newPassword
        } = req.body;

        const user = await userService.getUserByPhone(phone);

        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND,
            });
        }
        await userService.updatePassword(user.id, {
            password: newPassword
        });

        return res.status(200).json({
            message: SUCCESS_MESSAGE.PASSWORD_RESET_SUCCESS,
        });

    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.FORGET_PASSWORD_FAILED,
            error: error.message
        });
    }
}
export default forgetPassword;