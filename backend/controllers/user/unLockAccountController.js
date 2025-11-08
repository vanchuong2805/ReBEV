import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/**
 * @swagger
 * /api/users/{user_id}/unlock-account:
 *   patch:
 *     summary: Unlock a user account
 *     description: |
 *       Unlock the account of a user by their ID.  
 *       - If the account is not locked, returns 400.  
 *       - If the user does not exist, returns 404.
 *     tags: [Users]
 *     operationId: unlockUserAccount
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 7
 *         description: ID of the user to unlock
 *     responses:
 *       200:
 *         description: Account successfully unlocked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUnlockResponse'
 *             examples:
 *               success:
 *                 summary: Successful unlock
 *                 value:
 *                   message: "Account unlocked successfully"
 *                   data:
 *                     id: 7
 *                     display_name: "Nguyen Van B"
 *                     phone: "0909876543"
 *                     email: "nguyenb@example.com"
 *                     role: 0
 *                     balance: "150000.00"
 *                     avatar: "https://example.com/avatar.jpg"
 *                     package_id: 2
 *                     is_locked: false
 *                     package_start: "2025-01-01T07:00:00Z"
 *                     create_at: "2025-03-01T09:30:00Z"
 *                     update_at: "2025-10-30T09:00:00Z"
 *
 *       400:
 *         description: Account already unlocked or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               alreadyUnlocked:
 *                 summary: Account already unlocked
 *                 value:
 *                   message: "Account is already unlocked"
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
 *         description: Internal server error while unlocking account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *             examples:
 *               serverFailure:
 *                 summary: Server error example
 *                 value:
 *                   message: "Failed to unlock account"
 *                   error: "Database connection timeout"
 *
 * components:
 *   schemas:
 *     UserUnlockResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Account unlocked successfully"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 7
 *             display_name:
 *               type: string
 *               example: "Nguyen Van B"
 *             phone:
 *               type: string
 *               example: "0909876543"
 *             email:
 *               type: string
 *               example: "nguyenb@example.com"
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
 *               example: false
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
 *           example: "Account is already unlocked"
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
 *           example: "Failed to unlock account"
 *         error:
 *           type: string
 *           example: "Database connection timeout"
 */

const unLockAccount = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await userService.getUser(user_id);

        if (!user) {
            return res.status(404).json({
                message: ERROR_MESSAGE.USER_NOT_FOUND
            });
        }

        const isLocked = await userService.is_locked(user_id);

        if (!isLocked) {
            return res.status(400).json({
                message: ERROR_MESSAGE.ACCOUNT_ALREADY_UNLOCKED
            });
        }

        const result = await userService.unLockAccount(user_id);

        return res.status(200).json({
            message: SUCCESS_MESSAGE.ACCOUNT_UNLOCKED,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGE.ACCOUNT_UNLOCK_FAILED,
            error: error.message
        });
    }
};

export default unLockAccount;