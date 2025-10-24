import userService from "../../services/user/userService.js";
import { ERROR_MESSAGE } from "../../config/constants.js";
import { SUCCESS_MESSAGE } from "../../config/constants.js";

/** 
 * @swagger
 * /api/users/{user_id}/lock-account:
 *   patch:
 *     summary: Lock user account
 *     description: Lock a user account by user ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user to lock
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account locked successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
