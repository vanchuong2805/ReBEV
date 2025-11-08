import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/users/{user_id}/lock-account:
 *   patch:
 *     summary: Lock a user account
 *     description: |
 *       Lock the account of a user by their ID.  
 *       - If the account is already locked, returns 400.  
 *       - If the user does not exist, returns 404.
 *     tags: [Users]
 *     operationId: lockUserAccount
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *         description: ID of the user to lock
 *     responses:
 *       200:
 *         description: Account successfully locked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLockResponse'
 *             examples:
 *               success:
 *                 summary: Successful lock
 *                 value:
 *                   message: "Account locked successfully"
 *                   data:
 *                     id: 5
 *                     display_name: "Nguyen Van A"
 *                     phone: "0901234567"
 *                     email: "vana@example.com"
 *                     role: 0
 *                     balance: "150000.00"
 *                     avatar: "https://example.com/avatar.jpg"
 *                     package_id: 2
 *                     is_locked: true
 *                     package_start: "2025-01-01T07:00:00Z"
 *                     create_at: "2025-03-01T09:30:00Z"
 *                     update_at: "2025-10-30T09:00:00Z"
 *
 *       400:
 *         description: Account already locked or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               alreadyLocked:
 *                 summary: Account already locked
 *                 value:
 *                   message: "Account is already locked"
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               userNotFound:
 *                 summary: User not found example
 *                 value:
 *                   message: "User not found"
 *
 *       500:
 *         description: Internal server error while locking account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               serverFailure:
 *                 summary: Server error example
 *                 value:
 *                   message: "Failed to lock account"
 *                   error: "Database connection timeout"
 *
 * components:
 *   schemas:
 *     UserLockResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Account locked successfully"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 5
 *             display_name:
 *               type: string
 *               example: "Nguyen Van A"
 *             phone:
 *               type: string
 *               example: "0901234567"
 *             email:
 *               type: string
 *               example: "vana@example.com"
 *             role:
 *               type: integer
 *               example: 0
 *             balance:
 *               type: string
 *               example: "150000.00"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             package_id:
 *               type: integer
 *               nullable: true
 *               example: 2
 *             is_locked:
 *               type: boolean
 *               example: true
 *             package_start:
 *               type: string
 *               format: date-time
 *               example: "2025-01-01T07:00:00Z"
 *             create_at:
 *               type: string
 *               format: date-time
 *               example: "2025-03-01T09:30:00Z"
 *             update_at:
 *               type: string
 *               format: date-time
 *               example: "2025-10-30T09:00:00Z"
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Account is already locked"
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
 *           example: "Failed to lock account"
 *         error:
 *           type: string
 *           example: "Database connection timeout"
 */

const lockAccount = async (req, res) => {
    const { user_id } = req.params;
    try {

        const user = await userService.getUser(user_id);
        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND
            });
        }

        const isLocked = await userService.is_locked(user_id);
        if (isLocked) {
            return res.status(400).json({
                message: ERROR_MESSAGE.ACCOUNT_ALREADY_LOCKED
            });
        }

        const result = await userService.lockAccount(user_id);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.ACCOUNT_LOCKED,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.ACCOUNT_LOCK_FAILED,
            error: error.message
        });
    }
};

export default lockAccount;
